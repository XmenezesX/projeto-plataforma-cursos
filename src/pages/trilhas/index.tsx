import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { TrilhaService } from "../../services/TrilhaService";
import type { TrilhaDto } from "../../dto/TrilhaDto";
import { AppRoutes } from "../../routes/routes";

export default function Trilhas() {
    const navigate = useNavigate();
    const [trilhas, setTrilhas] = useState<TrilhaDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await TrilhaService.getAll();
            setTrilhas(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar trilhas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir esta trilha?")) {
            try {
                await TrilhaService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir trilha.");
            }
        }
    };

    const columns: TableColumn<TrilhaDto>[] = [
        { key: "ID_Trilha", label: "ID" },
        { key: "Titulo", label: "Título" },
        { key: "Descricao", label: "Descrição" },
        { key: "CategoriaNome", label: "Categoria" },
        {
            key: "acoes",
            label: "Ações",
            render: (t) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.trilhas.edit.replace(":id", String(t.ID_Trilha)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(t.ID_Trilha)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Trilhas de Conhecimento</h1>
                <Link to={AppRoutes.trilhas.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Trilha
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={trilhas} emptyMessage="Nenhuma trilha cadastrada." />
            )}
        </div>
    );
}
