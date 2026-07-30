import { Outlet } from "react-router-dom";

import Navbar from "../../components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer/Footer";

import "./PublicLayout.css";

function PublicLayout() {
  return (
    <>
      <Navbar />

      <main className="public-layout">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default PublicLayout;