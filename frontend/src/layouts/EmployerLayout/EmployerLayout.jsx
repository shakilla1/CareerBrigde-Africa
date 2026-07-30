import { Outlet } from "react-router-dom";

import EmployerSidebar from "../../components/employer/EmployerSidebar/EmployerSidebar";
import EmployerTopbar from "../../components/employer/EmployerTopbar/EmployerTopbar";

import "./EmployerLayout.css";

function EmployerLayout() {
  return (
    <div className="employer-layout">

      <EmployerSidebar />

      <div className="employer-layout__content">

        <EmployerTopbar />

        <main className="employer-layout__main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default EmployerLayout;