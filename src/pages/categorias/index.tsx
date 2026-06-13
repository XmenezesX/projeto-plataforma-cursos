import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { CategoriaService } from "../../services/CategoriaService";
import type { Categoria } from "../../model/Categoria";
import { AppRoutes } from "../../routes/routes";

export default function Categorias() {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await CategoriaService.getAll();
            setCategorias(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar categorias.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir esta categoria?")) {
            try {
                await CategoriaService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir categoria.");
            }
        }
    };

    const columns: TableColumn<Categoria>[] = [
        { key: "ID_Categoria", label: "ID" },
        { key: "Nome", label: "Nome" },
        { key: "Descricao", label: "Descrição" },
        {
            key: "acoes",
            label: "Ações",
            render: (cat) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.categorias.edit.replace(":id", String(cat.ID_Categoria)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(cat.ID_Categoria)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Categorias</h1>
                <Link to={AppRoutes.categorias.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Categoria
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={categorias} emptyMessage="Nenhuma categoria cadastrada." />
            )}
        </div>
    );
}
