import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { UsuarioService } from "../../services/UsuarioService";
import type { Usuario } from "../../model/Usuario";
import { AppRoutes } from "../../routes/routes";

export default function Usuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await UsuarioService.getAll();
            setUsuarios(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar usuários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir este usuário?")) {
            try {
                await UsuarioService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir usuário.");
            }
        }
    };

    const columns: TableColumn<Usuario>[] = [
        { key: "ID_Usuario", label: "ID" },
        { key: "NomeCompleto", label: "Nome Completo" },
        { key: "Email", label: "Email" },
        {
            key: "DataCadastro",
            label: "Data de Cadastro",
            render: (user) => new Date(user.DataCadastro).toLocaleString("pt-BR")
        },
        {
            key: "acoes",
            label: "Ações",
            render: (user) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.usuarios.edit.replace(":id", String(user.ID_Usuario)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(user.ID_Usuario)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Usuários</h1>
                <Link to={AppRoutes.usuarios.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Usuário
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={usuarios} emptyMessage="Nenhum usuário cadastrado." />
            )}
        </div>
    );
}
