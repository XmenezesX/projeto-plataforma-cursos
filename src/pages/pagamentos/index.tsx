import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { PagamentoService } from "../../services/PagamentoService";
import type { PagamentoDto } from "../../dto/PagamentoDto";
import { AppRoutes } from "../../routes/routes";

export default function Pagamentos() {
    const navigate = useNavigate();
    const [pagamentos, setPagamentos] = useState<PagamentoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await PagamentoService.getAll();
            setPagamentos(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar pagamentos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir este pagamento?")) {
            try {
                await PagamentoService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir pagamento.");
            }
        }
    };

    const columns: TableColumn<PagamentoDto>[] = [
        { key: "ID_Pagamento", label: "ID" },
        { key: "UsuarioNome", label: "Usuário" },
        { key: "PlanoNome", label: "Plano" },
        {
            key: "ValorPago",
            label: "Valor Pago",
            render: (p) => p.ValorPago.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        },
        {
            key: "DataPagamento",
            label: "Data de Pagamento",
            render: (p) => new Date(p.DataPagamento).toLocaleDateString("pt-BR")
        },
        { key: "MetodoPagamento", label: "Método de Pagamento" },
        {
            key: "Id_Transacao_Gateway",
            label: "ID Gateway Transação",
            render: (p) => <code className="bg-light p-1 border rounded">{p.Id_Transacao_Gateway}</code>
        },
        {
            key: "DataFim",
            label: "Data de Fim",
            render: (p) => new Date(p.DataFim).toLocaleDateString("pt-BR")
        },
        {
            key: "acoes",
            label: "Ações",
            render: (p) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.pagamentos.edit.replace(":id", String(p.ID_Pagamento)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(p.ID_Pagamento)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Pagamentos</h1>
                <Link to={AppRoutes.pagamentos.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Pagamento
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={pagamentos} emptyMessage="Nenhum pagamento cadastrado." />
            )}
        </div>
    );
}
