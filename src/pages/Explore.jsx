import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import data from "../data/data.json";
import StarRating from "../components/StarRating";
import Pagination from "../components/Pagination";
import FilterBar from "../components/FilterBar";

export default function Explore() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const allLabel = t("explore.all"); // Ambil label "All" dari i18n

  // Ambil semua destinasi dari data.json
  const destinations = data.flatMap(city =>
    city.places.map(place => ({ ...place, city: city.city }))
  );

  // Ambil filter dari URL query ?city=xxx, default ke allLabel
  const [activeCity, setActiveCity] = useState(searchParams.get("city") || allLabel);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Semua kota unik
  const cities = [allLabel, ...new Set(destinations.map(item => item.city))];

  // Sorting (opsional)
  const [activeSort, setActiveSort] = useState("rating");
  const sortOptions = [
    { label: t("explore.rating", "Rating"), value: "rating" },
    { label: t("explore.name", "Name"), value: "name" },
  ];

  // Handle filter kota
  const handleCityChange = (city) => {
    setActiveCity(city);
    setCurrentPage(1);
    if (city === allLabel) setSearchParams({});
    else setSearchParams({ city });
  };

  // Handle sort
  const handleSortChange = (value) => {
    setActiveSort(value);
  };

  // Filter destinasi
  let filteredDestinations =
    activeCity === allLabel
      ? destinations
      : destinations.filter(item => item.city === activeCity);

  // Apply sorting
  filteredDestinations = filteredDestinations.sort((a, b) => {
    if (activeSort === "rating") return b.rating - a.rating;
    if (activeSort === "name") return a.name[i18n.language].localeCompare(b.name[i18n.language]);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDestinations.slice(indexOfFirstItem, indexOfLastItem);

  // Reset halaman saat filter berubah
  useEffect(() => setCurrentPage(1), [activeCity]);

  // Sinkronisasi filter dari URL saat back/forward
  useEffect(() => {
    const cityFromURL = searchParams.get("city") || allLabel;
    setActiveCity(cityFromURL);
  }, [location.search, allLabel]);

  return (
    <div className="max-w-5xl mx-auto px-10 sm:px-6 py-30">
      {/* Filter + Sort */}
      <FilterBar
        cities={cities}
        activeCity={activeCity}
        onCityChange={handleCityChange}
        sortOptions={sortOptions}
        activeSort={activeSort}
        onSortChange={handleSortChange}
      />

      {/* Grid destinasi */}
      <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {currentItems.length > 0 ? (
          currentItems.map((place, index) => {
            const globalIndex = indexOfFirstItem + index;
            return (
              <div
                key={globalIndex}
                className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
              >
                {/* Gambar */}
                <img
                  src={place.image}
                  alt={place.name[i18n.language]}
                  className="w-full h-[50vh] sm:h-[50vh] lg:h-[60vh] object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Overlay bawah untuk info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 flex flex-col justify-end">
                  {/* Info destinasi (hilang saat hover) */}
                  <div className="transition-opacity duration-300 group-hover:opacity-0">
                    <h3 className="text-white font-bold text-lg">
                      {place.name[i18n.language]}
                    </h3>
                    <p className="text-gray-300 font-medium text-sm">
                      {place.category[i18n.language]}
                    </p>
                    <div className="flex items-center mt-1">
                      <StarRating rating={place.rating} />
                      <span className="ml-2 text-white">{place.rating}</span>
                    </div>
                  </div>

                  {/* Tombol Show More dengan garis */}
                  <button
                    onClick={() =>
                      navigate(
                        `/detail/${place.city}-${place.name.en}?city=${activeCity}`
                      )
                    }
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-lg font-semibold"
                  >
                    {/* Teks */}
                    <span>{t("explore.show_more")}</span>

                    {/* Opsi 1: Garis dengan animasi dari tengah */}
                    <span className="mt-2 block h-[2px] bg-white w-0 group-hover:w-24 transition-all duration-500 ease-out"></span>

                    {/* Opsi 2: Garis statis (non-animasi, selalu muncul saat hover) */}
                    {/* <span className="mt-2 w-24 h-[2px] bg-white"></span> */}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center col-span-3">{t("explore.no_data")}</p>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handleNextPage={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            handlePreviousPage={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          />
        </div>
      )}
    </div>
  );
}
