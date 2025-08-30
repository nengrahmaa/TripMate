import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Description */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">TripMate</h2>
          <p className="text-sm leading-relaxed">
            {t("footer.description")}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t("footer.quick_links")}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition">
                {t("footer.menu.home")}
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-white transition">
                {t("footer.menu.about")}
              </a>
            </li>
            <li>
              <a href="/explore" className="hover:text-white transition">
                {t("footer.menu.explore")}
              </a>
            </li>
            <li>
              <a href="/profile" className="hover:text-white transition">
                {t("footer.menu.profile")}
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t("footer.contact")}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-white" />
              <span>{t("footer.contact_info.address")}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-white" />
              <span>{t("footer.contact_info.phone")}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-white" />
              <span>{t("footer.contact_info.email")}</span>
            </li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            {t("footer.follow_us")}
          </h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-500 transition">
              <Facebook size={22} />
            </a>
            <a href="#" className="hover:text-pink-500 transition">
              <Instagram size={22} />
            </a>
            <a href="#" className="hover:text-sky-400 transition">
              <Twitter size={22} />
            </a>
            <a href="#" className="hover:text-red-500 transition">
              <Youtube size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TripMate. {t("footer.rights_reserved")}
      </div>
    </footer>
  );
}
