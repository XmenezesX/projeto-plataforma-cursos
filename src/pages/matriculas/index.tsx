import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { MatriculaService } from "../../services/MatriculaService";
import type { MatriculaDto } from "../../dto/MatriculaDto";
import { AppRoutes } from "../../routes/routes";

export default function Matriculas() {
    const navigate = useNavigate();
    const [matriculas, setMatriculas] = useState<MatriculaDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await MatriculaService.getAll();
            setMatriculas(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar matrículas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir esta matrícula?")) {
            try {
                await MatriculaService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir matrícula.");
            }
        }
    };

    const columns: TableColumn<MatriculaDto>[] = [
        { key: "ID_Matricula", label: "ID" },
        { key: "UsuarioNome", label: "Usuário" },
        { key: "CursoTitulo", label: "Curso" },
        {
            key: "DataMatricula",
            label: "Data da Matrícula",
            render: (m) => new Date(m.DataMatricula).toLocaleDateString("pt-BR")
        },
        {
            key: "DataConclusao",
            label: "Data de Conclusão",
            render: (m) => m.DataConclusao ? new Date(m.DataConclusao).toLocaleDateString("pt-BR") : <span className="text-muted">-</span>
        },
        {
            key: "acoes",
            label: "Ações",
            render: (m) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.matriculas.edit.replace(":id", String(m.id)))}
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
                <h1 className="h2 text-primary fw-bold mb-0">Matrículas</h1>
                <Link to={AppRoutes.matriculas.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Matrícula
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={matriculas} emptyMessage="Nenhuma matrícula cadastrada." />
            )}
        </div>
    );
}
