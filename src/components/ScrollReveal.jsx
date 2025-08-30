import { motion } from "framer-motion";

export default function ScrollReveal({
  children,
  delay = 0,
  y = 50,
  scale = 0.95,
  duration = 0.7,
  repeat = true,
  className = ""
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y, scale }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: !repeat, amount: 0.2 }}
      transition={{
        duration,
        ease: "easeInOut",
        delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
