import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { AvaliacaoService } from "../../services/AvaliacaoService";
import type { AvaliacaoDto } from "../../dto/AvaliacaoDto";
import { AppRoutes } from "../../routes/routes";

export default function Avaliacoes() {
    const navigate = useNavigate();
    const [avaliacoes, setAvaliacoes] = useState<AvaliacaoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await AvaliacaoService.getAll();
            setAvaliacoes(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar avaliações.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir esta avaliação?")) {
            try {
                await AvaliacaoService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir avaliação.");
            }
        }
    };

    const columns: TableColumn<AvaliacaoDto>[] = [
        { key: "ID_Avaliacao", label: "ID" },
        { key: "UsuarioNome", label: "Usuário" },
        { key: "CursoTitulo", label: "Curso" },
        {
            key: "Nota",
            label: "Nota",
            render: (a) => (
                <span className="text-warning">
                    {"★".repeat(a.Nota)}{"☆".repeat(5 - a.Nota)} ({a.Nota}/5)
                </span>
            )
        },
        { key: "Comentario", label: "Comentário" },
        {
            key: "DataAvaliacao",
            label: "Data",
            render: (a) => new Date(a.DataAvaliacao).toLocaleDateString("pt-BR")
        },
        {
            key: "acoes",
            label: "Ações",
            render: (a) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.avaliacoes.edit.replace(":id", String(a.ID_Avaliacao)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(a.ID_Avaliacao)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Avaliações</h1>
                <Link to={AppRoutes.avaliacoes.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Avaliação
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={avaliacoes} emptyMessage="Nenhuma avaliação registrada." />
            )}
        </div>
    );
}
