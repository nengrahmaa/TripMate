// components/FilterBar.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function FilterBar({
  cities,
  activeCity,
  onCityChange,
  sortOptions,
  activeSort,
  onSortChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      
      {/* Filter Kota */}
      <div className="flex flex-wrap gap-3">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onCityChange(city)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              activeCity === city
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-green-100"
            }`}
          >
            {t(`explore.${city.toLowerCase()}`, city)}
          </button>
        ))}
      </div>

      {/* Sorting */}
      {sortOptions && sortOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium text-sm">{t("explore.sort_by", "Sort by")}:</label>
          <select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`explore.${option.label.toLowerCase()}`, option.label)}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
