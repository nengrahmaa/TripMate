import './App.css'
import { Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';

function App() {

  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
      <BackToTop />
    </>
  )
}

export default App
