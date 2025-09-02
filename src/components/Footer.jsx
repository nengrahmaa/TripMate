import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
export default function Footer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth(); 

  const handleProtectedRoute = (path) => {
    if (!isLoggedIn) {
      alert(t("header.login_required"));
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <footer className="bg-cyan-950 dark:bg-gray-800 text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-200 mb-4">TripMate</h2>
          <p className="text-sm leading-relaxed">{t("footer.description")}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">{t("footer.quick_links")}</h3>
          <ul className="space-y-2 text-sm">
            {[
              { path: "/", label: t("footer.menu.home") },
              { path: "/about", label: t("footer.menu.about") },
              { path: "/explore", label: t("footer.menu.explore") },
              { path: "/profile", label: t("footer.menu.profile"), protected: true },
            ].map((link) => (
              <li key={link.path}>
                {link.protected ? (
                  <button
                    onClick={() => handleProtectedRoute(link.path)}
                    className={`hover:text-cyan-400 transition duration-200 ${
                      isActive(link.path) ? "text-cyan-400 font-semibold" : ""
                    }`}
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    to={link.path}
                    className={`hover:text-cyan-400 transition duration-200 ${
                      isActive(link.path) ? "text-cyan-400 font-semibold" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">{t("footer.contact")}</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-cyan-400" />
              <span>{t("footer.contact_info.address")}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-cyan-400" />
              <span>{t("footer.contact_info.phone")}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-cyan-400" />
              <span>{t("footer.contact_info.email")}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-200 mb-4">{t("footer.follow_us")}</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition duration-300"
            >
              <Facebook size={22} className="text-white" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-700 hover:bg-pink-500 transition duration-300"
            >
              <Instagram size={22} className="text-white" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-700 hover:bg-sky-400 transition duration-300"
            >
              <Twitter size={22} className="text-white" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-700 hover:bg-red-500 transition duration-300"
            >
              <Youtube size={22} className="text-white" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-cyan-700 mt-10 pt-4 text-center text-sm text-gray-200">
        © {new Date().getFullYear()} TripMate. {t("footer.rights_reserved")}
      </div>
    </footer>
  );
}
