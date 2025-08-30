import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import data from "../data/data.json";

export default function MyTrips({ userId }) {
  const { t, i18n } = useTranslation();
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false); // <-- baru

  // Flatten daftar destinasi dari data.json menjadi array { id, name, image }
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

        const id = place.id ?? `${cityKey}-${(place.name?.en) || name}`;
        if (name) list.push({ id, name, image: place.image || "" });
      });
    });

    // Deduplicate by name
    const seen = new Set();
    return list.filter((it) => {
      if (seen.has(it.name)) return false;
      seen.add(it.name);
      return true;
    });
  }, [i18n.language]);

  // Suggestions untuk input destinasi
  const suggestions = useMemo(() => {
    const q = (destination || "").trim().toLowerCase();
    if (!q) return [];
    return destinationList
      .filter((d) => d.name.toLowerCase().includes(q))
      .slice(0, 7);
  }, [destination, destinationList]);

  // Load trips user
  useEffect(() => {
    const savedTrips = JSON.parse(localStorage.getItem(`trips_${userId}`)) || [];
    setTrips(savedTrips);
  }, [userId]);

  const saveTrips = (newTrips) => {
    setTrips(newTrips);
    localStorage.setItem(`trips_${userId}`, JSON.stringify(newTrips));
  };

  // Menambahkan trip baru
  const handleCreateTrip = () => {
    if (!tripName.trim() || !destination.trim()) return;

    // Cari data destinasi lengkap untuk dapatkan image
    const selectedDestination = destinationList.find(
      (d) => d.name === destination
    );

    const newTrip = {
      id: Date.now(),
      name: tripName.trim(),
      destination: destination.trim(),
      image: selectedDestination?.image || "",
    };

    const updatedTrips = [...trips, newTrip];
    saveTrips(updatedTrips);

    setTripName("");
    setDestination("");
    setShowForm(false);
    setShowSuggestions(false); // pastikan dropdown tertutup
  };

  // Memilih suggestion — kita akan handle di onMouseDown agar terjadi sebelum blur
  const handleSelectSuggestion = (name) => {
    setDestination(name);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{t("trip.title")}</h1>

      {trips.length === 0 && (
        <div className="text-center py-10">
          <button
            onClick={() => setShowForm(true)}
            className="border rounded-lg w-full py-6 text-lg font-medium hover:bg-gray-50 transition"
          >
            {t("trip.new_trip")}
          </button>
          <div className="mt-10">
            <div className="text-5xl">❤️✈️</div>
            <p className="mt-3 text-gray-600">{t("trip.empty_message")}</p>
          </div>
        </div>
      )}

      {trips.length > 0 && (
        <div className="space-y-4">
          <button
            onClick={() => setShowForm(true)}
            className="border rounded-lg w-full py-6 text-lg font-medium hover:bg-gray-50 transition"
          >
            {t("trip.new_trip")}
          </button>

          <div className="grid gap-4 mt-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="p-4 border rounded-lg hover:shadow-md transition bg-white flex items-center gap-4"
              >
                {trip.image && (
                  <img
                    src={trip.image}
                    alt={trip.destination}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h2 className="font-semibold text-lg">{trip.name}</h2>
                  <p className="text-gray-600">📍 {trip.destination}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Date Picker */}
      {selectedTripId && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] shadow-lg">
            <h2 className="text-xl font-bold mb-4">Tambahkan tanggal</h2>
            <div className="flex flex-col gap-4">
              <DatePicker
                selected={tempStartDate}
                onChange={(date) => setTempStartDate(date)}
                selectsStart
                startDate={tempStartDate}
                endDate={tempEndDate}
                placeholderText="Tanggal mulai"
                className="border px-3 py-2 rounded-md w-full"
              />
              <DatePicker
                selected={tempEndDate}
                onChange={(date) => setTempEndDate(date)}
                selectsEnd
                startDate={tempStartDate}
                endDate={tempEndDate}
                minDate={tempStartDate}
                placeholderText="Tanggal akhir"
                className="border px-3 py-2 rounded-md w-full"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setSelectedTripId(null)}
                className="text-gray-600 hover:underline"
              >
                Batal
              </button>
              <button
                onClick={handleSaveDates}
                className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-end">
          <div className="bg-white w-full sm:w-[400px] p-6 h-full shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{t("trip.form.title")}</h2>

            {/* Nama Trip */}
            <label className="block mb-3">
              <span className="text-gray-700 text-sm">{t("trip.form.name")}</span>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder={t("trip.form.name_placeholder")}
                className="w-full border rounded-md px-3 py-2 mt-1"
                maxLength={80}
              />
            </label>

            {/* Input Destination */}
            <label className="block mb-6 relative">
              <span className="text-gray-700 text-sm">
                {t("trip.form.destination")}
              </span>
              <input
                type="text"
                value={destination}
                onChange={(e) => {
                  setDestination(e.target.value);
                  setShowSuggestions(true); // show on typing
                }}
                onFocus={() => setShowSuggestions(true)} // show on focus
                onBlur={() => {
                  // sembunyikan setelah sedikit delay supaya onMouseDown item sempat berjalan
                  setTimeout(() => setShowSuggestions(false), 150);
                }}
                placeholder={t("trip.form.destination_placeholder")}
                className="w-full border rounded-md px-3 py-2 mt-1"
                autoComplete="off"
              />

              {/* Suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border mt-1 w-full max-h-40 overflow-y-auto rounded-md shadow">
                  {suggestions.map((item) => (
                    <li
                      key={item.id}
                      // gunakan onMouseDown agar event terjadi sebelum input blur
                      onMouseDown={(e) => {
                        e.preventDefault(); // mencegah fokus pindah sebelum kita set value
                        handleSelectSuggestion(item.name);
                      }}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 object-cover rounded"
                        />
                      )}
                      <span>{item.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </label>

            {/* Tombol Aksi */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  setShowForm(false);
                  setShowSuggestions(false);
                }}
                className="text-gray-600 hover:underline"
              >
                {t("trip.form.cancel")}
              </button>
              <button
                onClick={handleCreateTrip}
                className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800"
              >
                {t("trip.form.create")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
