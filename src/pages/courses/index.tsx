import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { CursoService } from "../../services/CursoService";
import type { CursoDto } from "../../dto/CursoDto";
import { AppRoutes } from "../../routes/routes";

export default function Courses() {
    const navigate = useNavigate();
    const [cursos, setCursos] = useState<CursoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await CursoService.getAll();
            setCursos(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar a lista de cursos. Verifique se a API está rodando.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir este curso?")) {
            try {
                await CursoService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir curso.");
            }
        }
    };

    // Definição das colunas da tabela de cursos
    const columns: TableColumn<CursoDto>[] = [
        { key: "ID_Curso", label: "ID" },
        { key: "Titulo", label: "Título do Curso" },
        { key: "InstrutorNome", label: "Instrutor" },
        { key: "CategoriaNome", label: "Categoria" },
        {
            key: "Nivel",
            label: "Nível",
            render: (curso) => {
                const badgeColor =
                    curso.Nivel === "Iniciante" ? "bg-success" :
                        curso.Nivel === "Intermediário" ? "bg-warning text-dark" :
                            "bg-danger";
                return <span className={`badge ${badgeColor}`}>{curso.Nivel}</span>;
            }
        },
        {
            key: "TotalHoras",
            label: "Duração",
            render: (curso) => `${curso.TotalHoras}h`
        },
        {
            key: "TotalAulas",
            label: "Aulas",
            render: (curso) => `${curso.TotalAulas} aulas`
        },
        {
            key: "acoes",
            label: "Ações",
            render: (curso) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.courses.edit.replace(":id", String(curso.ID_Curso)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(curso.ID_Curso)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Cursos</h1>
                <Link to={AppRoutes.courses.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Curso
                </Link>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </div>
                </div>
            ) : (
                <Table
                    columns={columns}
                    data={cursos}
                    emptyMessage="Nenhum curso cadastrado."
                />
            )}
        </div>
    );
}