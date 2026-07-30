import { Outlet } from "react-router-dom";

import Sidebar from "../../components/dashboard/Sidebar/Sidebar";
import Topbar from "../../components/dashboard/Topbar/Topbar";

import "./StudentGraduateLayout.css";

function StudentGraduateLayout() {
  return (
    <div className="student-layout">

      <Sidebar />

      <div className="student-layout__content">

        <Topbar />

        <main className="student-layout__main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default StudentGraduateLayout;