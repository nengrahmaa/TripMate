import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import data from "../data/data.json";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, CalendarPlus, Trash2, Plane, PlusCircle } from "lucide-react";

export default function MyTrips({ userId }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [selectedTripId, setSelectedTripId] = useState(null);
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const storedUser = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };

  const toDateOrNull = (v) => {
    if (!v) return null;
    const d = v instanceof Date ? v : new Date(v);
    return isNaN(d.getTime()) ? null : d;
  };

  const formatDate = (d) =>
    d
      ? d.toLocaleDateString(i18n.language || undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
      : "";

  const destinationList = useMemo(() => {
    const list = [];
    if (!Array.isArray(data)) return list;

    data.forEach((city) => {
      const cityKey = city.city || "";
      const places = Array.isArray(city.places) ? city.places : [];

      places.forEach((place) => {
        const nameObj = place.name;
        let name = "";

        if (typeof nameObj === "string") {
          name = nameObj;
        } else if (nameObj && typeof nameObj === "object") {
          name =
            nameObj[i18n.language] ||
            nameObj.en ||
            Object.values(nameObj)[0] ||
            "";
        }

        const id = place.id ?? `${cityKey}-${place.name?.en || name}`;
        if (name) list.push({ id, name, image: place.image || "" });
      });
    });

    const seen = new Set();
    return list.filter((it) => {
      if (seen.has(it.name)) return false;
      seen.add(it.name);
      return true;
    });
  }, [i18n.language]);

  const suggestions = useMemo(() => {
    const q = (destination || "").trim().toLowerCase();
    if (!q) return [];
    return destinationList
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 7);
  }, [destination, destinationList]);

  useEffect(() => {
    if (!storedUser?.id) return;
    const raw = JSON.parse(localStorage.getItem(`trips_${storedUser.id}`)) || [];
    const parsed = raw.map((trip) => ({
      ...trip,
      destinationId: trip.destinationId || trip.destination || null,
      startDate: toDateOrNull(trip.startDate),
      endDate: toDateOrNull(trip.endDate),
    }));
    setTrips(parsed);
  }, [storedUser.id]);

  const saveTrips = (newTrips) => {
    if (!storedUser?.id) return;
    setTrips(newTrips);
    const serializable = newTrips.map((t) => ({
      ...t,
      startDate: t.startDate ? new Date(t.startDate).toISOString() : null,
      endDate: t.endDate ? new Date(t.endDate).toISOString() : null,
    }));
    localStorage.setItem(`trips_${storedUser.id}`, JSON.stringify(serializable));
  };

  const handleCreateTrip = () => {
    if (!tripName.trim() || !destination.trim()) return;

    const selectedDestination = destinationList.find(
      (d) => d.name === destination
    );

    if (!selectedDestination) return;

    const newTrip = {
      id: Date.now(),
      name: tripName.trim(),
      destinationId: selectedDestination.id,
      startDate: null,
      endDate: null,
      image: selectedDestination.image || "",
    };

    saveTrips([...trips, newTrip]);
    setTripName("");
    setDestination("");
    setShowForm(false);
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (name) => {
    setDestination(name);
    setShowSuggestions(false);
  };

  const handleSaveDates = () => {
    if (!selectedTripId) return;

    const updatedTrips = trips.map((trip) =>
      trip.id === selectedTripId
        ? { ...trip, startDate: toDateOrNull(tempStartDate), endDate: toDateOrNull(tempEndDate) }
        : trip
    );

    saveTrips(updatedTrips);
    setSelectedTripId(null);
    setTempStartDate(null);
    setTempEndDate(null);
  };

  const handleDeleteTrip = (tripId) => {
    const updatedTrips = trips.filter((trip) => trip.id !== tripId);
    saveTrips(updatedTrips);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-20 space-y-6 sm:space-y-10">
        {/* Back Button */}
        <div className="flex items-center justify-start mb-8 gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-cyan-700 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-700" />
          </motion.button>

          <h1 className="text-cyan-700 text-2xl md:text-3xl font-bold dark:text-white truncate">
            {t("trip.title")}
          </h1>
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <div className="text-center py-10">
            <button
              onClick={() => setShowForm(true)}
              className="border dark:border-gray-600 rounded-lg w-full py-6 text-lg font-medium text-cyan-900 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <PlusCircle className="inline-block w-5 h-5 mr-2" />
              {t("trip.new_trip")}
            </button>
            <div className="mt-10">
              <Plane className="w-12 h-12 text-cyan-700 mx-auto" />
              <p className="mt-3 text-gray-600 dark:text-gray-400">{t("trip.empty_message")}</p>
            </div>
          </div>
        )}

        {/* Trips List */}
        {trips.length > 0 && (
          <div className="space-y-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 border dark:border-gray-600 rounded-lg w-full py-4 text-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <PlusCircle className="w-5 h-5" />
              {t("trip.new_trip")}
            </button>

            <div className="grid gap-4 mt-6">
              {trips.map((trip) => {
                const sd = toDateOrNull(trip.startDate);
                const ed = toDateOrNull(trip.endDate);
                return (
                  <div key={trip.id} className="relative">
                    {/* Background merah untuk swipe delete */}
                    <div className="absolute inset-0 bg-red-500 rounded-lg flex items-center justify-end pr-6">
                      <Trash2 className="text-white w-6 h-6" />
                    </div>

                    <motion.div
                      drag="x"
                      dragConstraints={{ left: -150, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -100) handleDeleteTrip(trip.id);
                      }}
                      className="relative z-10 bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md flex items-center gap-4"
                    >
                      {trip.image && (
                        <img
                          src={trip.image}
                          alt={trip.destination}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}

                      <div className="flex-1">
                        <h2 className="font-semibold text-lg text-gray-900 dark:text-white">{trip.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-cyan-700" />
                          {destinationList.find((d) => d.id === trip.destinationId)?.name || "-"}
                        </p>
                        {!sd || !ed ? (
                          <button
                            onClick={() => {
                              setSelectedTripId(trip.id);
                              setTempStartDate(sd);
                              setTempEndDate(ed);
                            }}
                            className="mt-1 text-sm flex items-center gap-1 text-cyan-700 hover:underline"
                          >
                            <CalendarPlus className="w-4 h-4" />
                            {t("trip.add_date")}
                          </button>
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {`${formatDate(sd)} - ${formatDate(ed)}`}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal Date Picker */}
        {selectedTripId && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t("trip.add_date")}</h2>
              <div className="flex flex-col gap-4">
                <DatePicker
                  selected={tempStartDate}
                  onChange={(date) => setTempStartDate(date)}
                  selectsStart
                  startDate={tempStartDate}
                  endDate={tempEndDate}
                  placeholderText={t("trip.start_date")}
                  className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md w-full"
                />
                <DatePicker
                  selected={tempEndDate}
                  onChange={(date) => setTempEndDate(date)}
                  selectsEnd
                  startDate={tempStartDate}
                  endDate={tempEndDate}
                  minDate={tempStartDate}
                  placeholderText={t("trip.end_date")}
                  className="border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md w-full"
                />
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setSelectedTripId(null)}
                  className="text-gray-600 dark:text-gray-300 hover:underline"
                >
                  {t("trip.cancel")}
                </button>
                <button
                  onClick={handleSaveDates}
                  className="bg-cyan-700 hover:bg-cyan-800 text-white px-5 py-2 rounded-lg"
                >
                  {t("trip.apply")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Tambah Trip */}
        {showForm && (
          <div className="fixed inset-0 bg-black/30 dark:bg-black/40 flex justify-end z-50">
            <div className="bg-white dark:bg-gray-800 w-full sm:w-[400px] p-6 py-16 h-full shadow-lg overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{t("trip.form.title")}</h2>

              <label className="block mb-3">
                <span className="text-gray-700 dark:text-gray-300 text-sm">{t("trip.form.name")}</span>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder={t("trip.form.name_placeholder")}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 mt-1"
                  maxLength={80}
                />
              </label>

              <label className="block mb-6 relative">
                <span className="text-gray-700 dark:text-gray-300 text-sm">{t("trip.form.destination")}</span>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  placeholder={t("trip.form.destination_placeholder")}
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md px-3 py-2 mt-1"
                  autoComplete="off"
                />
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute z-10 bg-white dark:bg-gray-700 border dark:border-gray-600 mt-1 w-full max-h-40 overflow-y-auto rounded-md shadow">
                    {suggestions.map((item) => (
                      <li
                        key={item.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectSuggestion(item.name);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer flex items-center gap-2"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                        )}
                        <span className="text-gray-900 dark:text-white">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </label>

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setShowSuggestions(false);
                  }}
                  className="text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  {t("trip.form.cancel")}
                </button>
                <button
                  onClick={handleCreateTrip}
                  className="bg-cyan-700 hover:bg-cyan-800 text-white px-5 py-2 rounded-lg"
                >
                  {t("trip.form.create")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
