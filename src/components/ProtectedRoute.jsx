import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // Jika komponen children adalah Logout
  if (children.type?.name === "Logout") {
    return <Navigate to="/" replace />;
  }

  // Default: cek user login
  return user ? children : <Navigate to="/login" replace />;
}
