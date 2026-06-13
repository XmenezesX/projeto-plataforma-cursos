import { Link } from "react-router-dom";
import { AppRoutes } from "../../routes/routes";

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="container-fluid px-3">
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
        </div>
      </nav>
    </header>
  );
}