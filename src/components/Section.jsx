import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom"; 


export default function Section() {
  const { t } = useTranslation();
   const navigate = useNavigate();

  return (
    <section className="bg-gray-100 dark:bg-gray-900 py-16 px-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h2
            className="text-3xl lg:text-4xl font-extrabold text-cyan-900 dark:text-gray-100 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t("home.about_title")}
          </motion.h2>

          <motion.p
            className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t("home.about_desc")}
          </motion.p>

          <div className="flex flex-wrap gap-6 mb-8">
            <motion.div
              className="bg-cyan-600 text-gray-50 text-center rounded-xl px-6 py-4 shadow-lg flex-1 min-w-[120px]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <p className="text-4xl font-extrabold">5</p>
              <p className="text-sm mt-1 uppercase tracking-wide">
                {t("home.cities")}
              </p>
            </motion.div>

            <motion.div
              className="bg-cyan-600 text-gray-50 text-center rounded-xl px-6 py-4 shadow-lg flex-1 min-w-[120px]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <p className="text-4xl font-extrabold">39</p>
              <p className="text-sm mt-1 uppercase tracking-wide">
                {t("home.destinations")}
              </p>
            </motion.div>
          </div>

          <motion.button
            onClick={() => navigate("/explore")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white bg-gradient-to-r from-cyan-800 to-cyan-900 font-semibold shadow-md hover:shadow-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t("home.explore")}
            <ArrowRight size={18} />
          </motion.button>
        </div>

        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <img
            src="https://i.pinimg.com/736x/3e/ad/22/3ead2227f60b2f8a4a6f107bf00c408c.jpg"
            alt="Destination 1"
            className="rounded-xl shadow-lg object-cover h-48 sm:h-56 md:h-64 w-full hover:scale-105 transition-transform duration-300"
          />
          <img
            src="https://www.jonnymelon.com/wp-content/uploads/2021/07/pandawa-beach-5.jpg"
            alt="Destination 2"
            className="rounded-xl shadow-lg object-cover h-48 sm:h-56 md:h-64 w-full hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      </div>
    </section>
  );
}
