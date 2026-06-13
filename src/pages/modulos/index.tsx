import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { ModuloService } from "../../services/ModuloService";
import type { ModuloDto } from "../../dto/ModuloDto";
import { AppRoutes } from "../../routes/routes";

export default function Modulos() {
    const navigate = useNavigate();
    const [modulos, setModulos] = useState<ModuloDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await ModuloService.getAll();
            setModulos(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar módulos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir este módulo?")) {
            try {
                await ModuloService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir módulo.");
            }
        }
    };

    const columns: TableColumn<ModuloDto>[] = [
        { key: "ID_Modulo", label: "ID" },
        { key: "CursoTitulo", label: "Curso" },
        { key: "Titulo", label: "Título" },
        { key: "Ordem", label: "Ordem" },
        {
            key: "acoes",
            label: "Ações",
            render: (m) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.modulos.edit.replace(":id", String(m.id)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(m.id)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Módulos</h1>
                <Link to={AppRoutes.modulos.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Módulo
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={modulos} emptyMessage="Nenhum módulo cadastrado." />
            )}
        </div>
    );
}
