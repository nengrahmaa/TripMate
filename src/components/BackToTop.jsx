import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function BackToTop({ scrollThreshold = 300 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      setVisible(window.scrollY > scrollThreshold);
    };

    window.onscroll = checkScroll;

    return () => {
      window.onscroll = null;
    };
  }, [scrollThreshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-400 text-cyan-800 dark:bg-gray-800 dark:text-cyan-300 p-3 rounded-full shadow-lg hover:bg-gray-700 hover:text-white dark:hover:bg-gray-600 dark:hover:text-cyan-100 focus:outline-none"        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
