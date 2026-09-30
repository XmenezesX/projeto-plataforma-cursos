import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Routes from "./routes";
import { AppRoutes } from "./routes/routes";
import { AuthService } from "./services/AuthService";

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(AuthService.isAuthenticated());
  const location = useLocation();

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(AuthService.isAuthenticated());
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isLoginPage = location.pathname === AppRoutes.login;

  // Se estiver na tela de login ou não autenticado, exibe apenas a rota (sem sidebar)
  if (isLoginPage || !isAuthenticated) {
    return <Routes />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar onToggleSidebar={toggleSidebar} />
      <div className="container-fluid flex-grow-1">
        <div className="row">
          {/* Sidebar para Desktop */}
          <div className="col-md-3 col-lg-2 px-0 bg-light border-end d-none d-md-block">
            <Sidebar />
          </div>

          {/* Backdrop para Sidebar no Mobile */}
          {isSidebarOpen && (
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-md-none"
              style={{ zIndex: 1040 }}
              onClick={closeSidebar}
            />
          )}

          {/* Offcanvas para Sidebar no Mobile */}
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

          {/* Conteúdo Principal */}
          <main className="col-12 col-md-9 col-lg-10 py-4 px-md-4">
            <Routes />
          </main>
        </div>
      </div>
    </div>
  );
}
