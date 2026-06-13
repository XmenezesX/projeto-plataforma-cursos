import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { PlanoService } from "../../services/PlanoService";
import type { Plano } from "../../model/Plano";
import { AppRoutes } from "../../routes/routes";

export default function Planos() {
    const navigate = useNavigate();
    const [planos, setPlanos] = useState<Plano[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await PlanoService.getAll();
            setPlanos(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar planos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir este plano?")) {
            try {
                await PlanoService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir plano.");
            }
        }
    };

    const columns: TableColumn<Plano>[] = [
        { key: "ID_Plano", label: "ID" },
        { key: "Nome", label: "Nome" },
        { key: "Descricao", label: "Descrição" },
        { 
            key: "Preco", 
            label: "Preço",
            render: (p) => p.Preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
        },
        { 
            key: "DuracaoMeses", 
            label: "Duração",
            render: (p) => `${p.DuracaoMeses} ${p.DuracaoMeses === 1 ? "mês" : "meses"}`
        },
        {
            key: "acoes",
            label: "Ações",
            render: (p) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button 
                        onClick={() => navigate(AppRoutes.planos.edit.replace(":id", String(p.id)))} 
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
                <h1 className="h2 text-primary fw-bold mb-0">Planos</h1>
                <Link to={AppRoutes.planos.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Plano
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={planos} emptyMessage="Nenhum plano cadastrado." />
            )}
        </div>
    );
}
