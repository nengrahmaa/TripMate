import { useState } from "react";
import { useTranslation } from "react-i18next";
import aboutData from "../translations/about.json";
import { MapPin, Heart, Edit3, Moon, UserCheck } from "lucide-react";
import { motion, useViewportScroll, useTransform } from "framer-motion";
import ScrollReveal from "../components/ScrollReveal";

export default function About() {
    const { i18n } = useTranslation();
    const lang = i18n.language || "en";
    const { about } = aboutData;
    const [openFAQ, setOpenFAQ] = useState(null);

    const servicesIcons = {
        MapPin: <MapPin size={27} className="text-green-600" />,
        Heart: <Heart size={27} className="text-red-500" />,
        Edit3: <Edit3 size={27} className="text-blue-500" />,
        Moon: <Moon size={27} className="text-gray-700" />,
        UserCheck: <UserCheck size={27} className="text-purple-500" />,
    };

    const { scrollY } = useViewportScroll();
    const yImage = useTransform(scrollY, [0, 500], [0, -50]);

    return (
        <div className="max-w-5xl mx-auto px-6 py-28 space-y-20">
            {/* Title */}
            <ScrollReveal>
                <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-950 bg-clip-text">
                    {about?.title?.[lang]}
                </h1>
            </ScrollReveal>

            {/* Image with Parallax */}
            {about?.image && (
                <motion.div
                    style={{ y: yImage }}
                    className="w-full h-64 md:h-96 overflow-hidden rounded-2xl shadow-xl"
                >
                    <img
                        src={about.image}
                        alt={"About"}
                        className="w-full h-full object-cover object-center"
                    />
                </motion.div>
            )}

            {/* Description */}
            <ScrollReveal delay={0.2}>
                <p className="text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-300 text-justify">
                    {about?.description?.[lang]}
                </p>
            </ScrollReveal>

            {/* Services */}
            <ScrollReveal>
                <h2 className="text-2xl font-bold mb-8 text-center text-green-700">
                    {about?.services_title?.[lang]}
                </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.isArray(about?.services) &&
                    about.services.map((service, idx) => (
                        <ScrollReveal key={idx} delay={idx * 0.15}>
                            <motion.div
                                className="flex items-center gap-4 p-5 border rounded-2xl shadow-lg bg-white dark:bg-gray-900 cursor-pointer"
                                whileHover={{ scale: 1.05, y: -5, rotate: 2 }}
                                whileTap={{ scale: 0.95, y: 0, rotate: 0 }}
                            >
                                <div>{servicesIcons[service.icon]}</div>
                                <p className="text-gray-700 dark:text-gray-200 text-sm">
                                    {service?.[lang]}
                                </p>
                            </motion.div>
                        </ScrollReveal>
                    ))}
            </div>

            {/* FAQ */}
            <ScrollReveal>
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
                    {about?.faq_title?.[lang]}
                </h2>
            </ScrollReveal>
            <div className="space-y-4">
                {Array.isArray(about?.faq) &&
                    about.faq.map((item, idx) => (
                        <ScrollReveal key={idx} delay={idx * 0.2}>
                            <motion.div className="border rounded-xl overflow-hidden">
                                <button
                                    className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex justify-between items-center text-sm font-medium"
                                    onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                                >
                                    <span>{item?.question?.[lang]}</span>
                                    <span className="text-lg">{openFAQ === idx ? "-" : "+"}</span>
                                </button>
                                {openFAQ === idx && (
                                    <motion.div
                                        className="px-4 py-3 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        {item?.answer?.[lang]}
                                    </motion.div>
                                )}
                            </motion.div>
                        </ScrollReveal>
                    ))}
            </div>
        </div>
    );
}
