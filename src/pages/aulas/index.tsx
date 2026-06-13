import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { AulaService } from "../../services/AulaService";
import type { AulaDto } from "../../dto/AulaDto";
import { AppRoutes } from "../../routes/routes";

export default function Aulas() {
    const navigate = useNavigate();
    const [aulas, setAulas] = useState<AulaDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await AulaService.getAll();
            setAulas(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar aulas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir esta aula?")) {
            try {
                await AulaService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir aula.");
            }
        }
    };

    const columns: TableColumn<AulaDto>[] = [
        { key: "ID_Aula", label: "ID" },
        { key: "ModuloTitulo", label: "Módulo" },
        { key: "Titulo", label: "Título" },
        { 
            key: "TipoConteudo", 
            label: "Tipo",
            render: (aula) => {
                const badgeColor = 
                    aula.TipoConteudo === "Vídeo" ? "bg-info text-dark" :
                    aula.TipoConteudo === "Texto" ? "bg-secondary" :
                    "bg-primary";
                return <span className={`badge ${badgeColor}`}>{aula.TipoConteudo}</span>;
            }
        },
        { 
            key: "URL_Conteudo", 
            label: "Conteúdo",
            render: (aula) => <a href={aula.URL_Conteudo} target="_blank" rel="noreferrer">Acessar</a>
        },
        { key: "DuracaoMinutos", label: "Duração (min)" },
        { key: "Ordem", label: "Ordem" },
        {
            key: "acoes",
            label: "Ações",
            render: (aula) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button 
                        onClick={() => navigate(AppRoutes.aulas.edit.replace(":id", String(aula.id)))} 
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button 
                        onClick={() => handleDelete(aula.id)} 
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
                <h1 className="h2 text-primary fw-bold mb-0">Aulas</h1>
                <Link to={AppRoutes.aulas.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Aula
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={aulas} emptyMessage="Nenhuma aula cadastrada." />
            )}
        </div>
    );
}
