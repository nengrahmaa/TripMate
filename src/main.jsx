import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './translations/translation';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';
import Profile from './pages/Profile.jsx';
import Wishlist from './pages/Wishlist.jsx';
import Reviews from './pages/Review.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx'; 
import Explore from './pages/Explore.jsx';
import Detail from './pages/DetailPage.jsx';
import ReviewPage from './pages/ReviewPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/about", element: <ProtectedRoute><About /></ProtectedRoute> },
      { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "/wishlist", element: <ProtectedRoute><Wishlist /></ProtectedRoute> },
      { path: "/reviews", element: <ProtectedRoute><Reviews /></ProtectedRoute> },
      { path: "/explore", element: <ProtectedRoute><Explore /></ProtectedRoute> },
      { path: "/detail/:id", element: <ProtectedRoute><Detail /></ProtectedRoute> },
      { path: "/reviews/:id", element: <ProtectedRoute><ReviewPage /></ProtectedRoute> }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
