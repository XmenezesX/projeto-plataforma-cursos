import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { AssinaturaService } from "../../services/AssinaturaService";
import type { AssinaturaDto } from "../../dto/AssinaturaDto";
import { AppRoutes } from "../../routes/routes";

export default function Assinaturas() {
    const navigate = useNavigate();
    const [assinaturas, setAssinaturas] = useState<AssinaturaDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await AssinaturaService.getAll();
            setAssinaturas(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar assinaturas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir esta assinatura?")) {
            try {
                await AssinaturaService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir assinatura.");
            }
        }
    };

    const columns: TableColumn<AssinaturaDto>[] = [
        { key: "ID_Assinatura", label: "ID" },
        { key: "UsuarioNome", label: "Usuário" },
        { key: "PlanoNome", label: "Plano" },
        {
            key: "DataInicio",
            label: "Data de Início",
            render: (a) => new Date(a.DataInicio).toLocaleDateString("pt-BR")
        },
        {
            key: "DataFim",
            label: "Data de Fim",
            render: (a) => new Date(a.DataFim).toLocaleDateString("pt-BR")
        },
        {
            key: "acoes",
            label: "Ações",
            render: (a) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.assinaturas.edit.replace(":id", String(a.ID_Assinatura)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(a.ID_Assinatura)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Assinaturas</h1>
                <Link to={AppRoutes.assinaturas.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Assinatura
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={assinaturas} emptyMessage="Nenhuma assinatura cadastrada." />
            )}
        </div>
    );
}
