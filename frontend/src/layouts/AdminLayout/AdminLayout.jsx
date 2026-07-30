import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar/AdminTopbar";

import "./AdminLayout.css";

function AdminLayout() {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="admin-layout__content">

        <AdminTopbar />

        <main className="admin-layout__main">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;