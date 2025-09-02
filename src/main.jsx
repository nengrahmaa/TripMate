import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './json/translations/translation';

import App from './App.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import About from './pages/About.jsx';
import Profile from './pages/Profile.jsx';
import Reviews from './pages/Review.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Explore from './pages/Explore.jsx';
import Detail from './pages/DetailDestinasi.jsx';
import DetailKota from './pages/DetailKota.jsx';
import ReviewPage from './pages/ReviewPage.jsx';
import BackToTop from './components/BackToTop.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import MyTrips from './pages/MyTrip.jsx';
import { LangProvider } from './context/LangContext.jsx';
import Favorites from './pages/Favorites.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/about", element: <About /> },
      { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "/trips", element: <ProtectedRoute><MyTrips /></ProtectedRoute> },
      { path: "/reviews", element: <ProtectedRoute><Reviews /></ProtectedRoute> },
      { path: "/explore", element: <ProtectedRoute><Explore /></ProtectedRoute> },
      { path: "/detail/:id", element: <ProtectedRoute><Detail /></ProtectedRoute> },
      { path: "/cities/:cityId", element: <ProtectedRoute><DetailKota /></ProtectedRoute> },
      { path: "/reviews/:id", element: <ProtectedRoute><ReviewPage /></ProtectedRoute> },
      { path: "/favorites", element: <ProtectedRoute><Favorites /></ProtectedRoute> }
    ]
  }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <LangProvider>
          <RouterProvider router={router} />
          <BackToTop />
        </LangProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
