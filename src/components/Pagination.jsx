import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Pagination({
  currentPage,
  totalPages,
  handleNextPage,
  handlePreviousPage,
}) {
  const { t } = useTranslation();

  // Fungsi untuk generate halaman dengan ellipsis
  const getPageNumbers = () => {
    let pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center pt-15 gap-3">
      {/* Tombol Sebelumnya */}
      <button
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        className={`p-2 rounded-md border text-sm transition-colors ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        }`}
        title={t("previous")}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Nomor Halaman */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={index}
              className="px-2 text-gray-400 select-none font-medium dark:text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => {
                if (page !== currentPage) {
                  if (page < currentPage) {
                    handlePreviousPage(page);
                  } else {
                    handleNextPage(page);
                  }
                }
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-green-500 text-white dark:bg-green-600"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Tombol Selanjutnya */}
      <button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-md border text-sm transition-colors ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
        }`}
        title={t("next")}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
