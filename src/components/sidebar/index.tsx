import { Link, useLocation } from "react-router-dom";
import { AppRoutes } from "../../routes/routes";

interface SidebarProps {
  onItemClick?: () => void;
}

export default function Sidebar({ onItemClick }: SidebarProps) {
  const location = useLocation();

  const menuGroups = [
    {
      title: "Geral",
      items: [
        { path: AppRoutes.home, label: "Home", icon: "bi bi-house-door" },
      ],
    },
    {
      title: "Core",
      items: [
        { path: AppRoutes.usuarios.index, label: "Usuários", icon: "bi bi-people" },
        { path: AppRoutes.categorias.index, label: "Categorias", icon: "bi bi-tags" },
        { path: AppRoutes.courses.index, label: "Cursos", icon: "bi bi-book" },
      ],
    },
    {
      title: "Conteúdo",
      items: [
        { path: AppRoutes.modulos.index, label: "Módulos", icon: "bi bi-folder2" },
        { path: AppRoutes.aulas.index, label: "Aulas", icon: "bi bi-play-btn" },
      ],
    },
    {
      title: "Interação",
      items: [
        { path: AppRoutes.matriculas.index, label: "Matrículas", icon: "bi bi-clipboard" },
        { path: AppRoutes.progresso.index, label: "Progresso Aulas", icon: "bi bi-bar-chart-line" },
        { path: AppRoutes.avaliacoes.index, label: "Avaliações", icon: "bi bi-star" },
      ],
    },
    {
      title: "Curadoria",
      items: [
        { path: AppRoutes.trilhas.index, label: "Trilhas", icon: "bi bi-signpost-split" },
        { path: AppRoutes.trilhasCursos.index, label: "Trilhas Cursos", icon: "bi bi-bezier2" },
        { path: AppRoutes.certificados.index, label: "Certificados", icon: "bi bi-patch-check" },
      ],
    },
    {
      title: "Negócio / Financeiro",
      items: [
        { path: AppRoutes.planos.index, label: "Planos", icon: "bi bi-card-list" },
        { path: AppRoutes.assinaturas.index, label: "Assinaturas", icon: "bi bi-journal-check" },
        { path: AppRoutes.pagamentos.index, label: "Pagamentos", icon: "bi bi-credit-card" },
      ],
    },
  ];

  return (
    <aside className="d-flex flex-column p-3 bg-light h-100" >
      {menuGroups.map((group) => (
        <div key={group.title} className="mb-4">
          <h6 className="text-uppercase text-muted fw-bold mb-2" style={{ fontSize: "0.75rem" }}>
            {group.title}
          </h6>
          <ul className="nav nav-pills flex-column">
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    onClick={onItemClick}
                    className={`nav-link py-2 px-3 d-flex align-items-center gap-2 ${isActive ? "active text-white" : "text-dark"}`}
                    style={isActive ? {} : { transition: "background-color 0.2s" }}
                  >
                    <i className={item.icon} style={{ fontSize: "1.1rem" }}></i>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </aside>
  );
}
