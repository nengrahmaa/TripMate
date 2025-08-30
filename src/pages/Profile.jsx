import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return null; // safety check

  const handleLogout = () => {
    if (window.confirm(t("profile.confirm_logout"))) {
      logout();        
      navigate("/");   // redirect ke Home
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold mb-4">{t("profile.title")}</h1>
      <p className="mb-6">
        {t("profile.welcome")}, <strong>{user.username}</strong>
      </p>

      <div className="space-y-6">
        <button
          onClick={() => navigate("/wishlist")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {t("profile.wishlist")}
        </button>
        <button
          onClick={() => navigate("/reviews")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("profile.reviews")}
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          {t("profile.logout")}
        </button>
      </div>
    </div>
  );
}
