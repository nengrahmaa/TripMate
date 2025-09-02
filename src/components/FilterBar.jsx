import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function FilterBar({ cities, activeCity, onCityChange, sortOptions, activeSort, onSortChange, }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full pb-4 sm:pb-8 transition-colors duration-500">
      <div className="flex flex-wrap gap-2 justify-start items-center">
        <AnimatePresence initial={false}>
          {cities.map((city) => {
            const isActive = activeCity === city;
            return (
              <motion.button
                key={city}
                onClick={() => onCityChange(city)}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap
                  ${isActive
                    ? "bg-cyan-700 text-white border-cyan-600 dark:bg-cyan-600 dark:border-cyan-500"
                    : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-cyan-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-cyan-900"
                  }`}
              >
                {t(`explore.${city.toLowerCase()}`, city)}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Sorting */}
      {sortOptions && sortOptions.length > 0 && (
        <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full sm:w-auto transition-colors duration-500">
          <label className="text-gray-700 dark:text-gray-300 font-medium text-sm whitespace-nowrap">
            {t("explore.sort_by", "Sort by")}:
          </label>
          <motion.select
            value={activeSort}
            onChange={(e) => onSortChange(e.target.value)}
            whileFocus={{ scale: 1.02 }}
            className="border border-gray-300 dark:border-gray-600 rounded-md text-sm sm:text-sm px-2 py-1 sm:px-3 sm:py-2 cursor-pointer
                       bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium w-full sm:w-auto appearance-none
                       transition-colors duration-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-300"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`explore.${option.label.toLowerCase()}`, option.label)}
              </option>
            ))}
          </motion.select>
        </div>
      )}
    </div>
  );
}
