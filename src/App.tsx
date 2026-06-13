import { useState } from "react";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Routes from "./routes";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="container-fluid flex-grow-1">
        <div className="row">

          {/* Sidebar for Desktop */}
          <div className="col-md-3 col-lg-2 px-0 bg-light border-end d-none d-md-block">
            <Sidebar />
          </div>

          {/* Mobile Sidebar Backdrop */}
          {isSidebarOpen && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
              style={{ zIndex: 1040 }}
              onClick={closeSidebar}
            />
          )}

          {/* Mobile Sidebar Offcanvas */}
          <div
            className="position-fixed top-0 start-0 h-100 bg-light border-end d-md-none"
            style={{
              width: "280px",
              zIndex: 1050,
              transition: "transform 0.3s ease-in-out",
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
              paddingTop: "56px",
              overflowY: "auto",
            }}
          >
            <Sidebar onItemClick={closeSidebar} />
          </div>

          {/* Main Content */}
          <main className="col-12 col-md-9 col-lg-10 py-4 px-md-4">
            <Routes />
          </main>
        </div>
      </div>
    </div>
  );
}
