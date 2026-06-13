import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { TrilhaCursoService } from "../../services/TrilhaCursoService";
import type { TrilhaCursoDto } from "../../dto/TrilhaCursoDto";
import { AppRoutes } from "../../routes/routes";

export default function TrilhasCursos() {
    const navigate = useNavigate();
    const [trilhasCursos, setTrilhasCursos] = useState<TrilhaCursoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await TrilhaCursoService.getAll();
            setTrilhasCursos(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar associação de cursos e trilhas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir esta associação?")) {
            try {
                await TrilhaCursoService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir associação.");
            }
        }
    };

    const columns: TableColumn<TrilhaCursoDto>[] = [
        { key: "TrilhaTitulo", label: "Trilha" },
        { key: "CursoTitulo", label: "Curso" },
        { key: "Ordem", label: "Ordem da Trilha" },
        {
            key: "acoes",
            label: "Ações",
            render: (tc) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.trilhasCursos.edit.replace(":id", tc.id))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(tc.id)}
                        className="btn btn-sm btn-outline-danger"
                    >
                        Excluir
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="h2 text-primary fw-bold mb-0">Trilhas & Cursos</h1>
                <Link to={AppRoutes.trilhasCursos.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Associar Curso
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={trilhasCursos} emptyMessage="Nenhuma associação cadastrada." />
            )}
        </div>
    );
}
