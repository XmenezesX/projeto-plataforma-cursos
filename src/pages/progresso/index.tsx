import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { ProgressoAulaService } from "../../services/ProgressoAulaService";
import type { ProgressoAulaDto } from "../../dto/ProgressoAulaDto";
import { AppRoutes } from "../../routes/routes";

export default function Progresso() {
    const navigate = useNavigate();
    const [progresso, setProgresso] = useState<ProgressoAulaDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await ProgressoAulaService.getAll();
            setProgresso(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar progresso.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir este registro de progresso?")) {
            try {
                await ProgressoAulaService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir registro.");
            }
        }
    };

    const columns: TableColumn<ProgressoAulaDto>[] = [
        { key: "UsuarioNome", label: "Usuário" },
        { key: "AulaTitulo", label: "Aula" },
        {
            key: "DataConclusao",
            label: "Data de Conclusão",
            render: (p) => p.DataConclusao ? new Date(p.DataConclusao).toLocaleDateString("pt-BR") : <span className="text-muted">-</span>
        },
        {
            key: "Status",
            label: "Status",
            render: (p) => {
                const badgeColor =
                    p.Status === "Concluído" ? "bg-success" :
                        p.Status === "Iniciado" ? "bg-warning text-dark" :
                            "bg-secondary";
                return <span className={`badge ${badgeColor}`}>{p.Status}</span>;
            }
        },
        {
            key: "acoes",
            label: "Ações",
            render: (p) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.progresso.edit.replace(":id", String(p.id)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(p.id)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Progresso de Aulas</h1>
                <Link to={AppRoutes.progresso.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Progresso
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={progresso} emptyMessage="Nenhum progresso registrado." />
            )}
        </div>
    );
}
