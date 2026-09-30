import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes/routes";
import { AuthService } from "../../services/AuthService";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<Record<string, unknown> | null>(
    AuthService.getCurrentUser()
  );

  useEffect(() => {
    const handleAuthChange = () => {
      setCurrentUser(AuthService.getCurrentUser());
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate(AppRoutes.login, { replace: true });
  };

  const handleLogin = () => {
    navigate(AppRoutes.login);
  };

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="container-fluid px-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            {onToggleSidebar && (
              <button
                className="btn btn-dark d-md-none me-2 p-1 border-0"
                type="button"
                onClick={onToggleSidebar}
                aria-label="Alternar menu lateral"
              >
                <i className="bi bi-list fs-3"></i>
              </button>
            )}
            <Link className="navbar-brand fw-bold" to={AppRoutes.home}>
              Plataforma de Cursos
            </Link>
          </div>

          {/* Seção de Usuário / Sessão */}
          <div className="d-flex align-items-center gap-3">
            {currentUser ? (
              <div className="d-flex align-items-center gap-2">
                <span className="text-light small">
                  <i className="bi bi-person-circle me-1"></i>
                  {String(currentUser.NomeCompleto || currentUser.Email || "")}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm"
                  title="Desconectar"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
              >
                <i className="bi bi-box-arrow-in-right"></i>
                Entrar
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}