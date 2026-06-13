import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Table, { type TableColumn } from "../../components/table";
import { CertificadoService } from "../../services/CertificadoService";
import type { CertificadoDto } from "../../dto/CertificadoDto";
import { AppRoutes } from "../../routes/routes";

export default function Certificados() {
    const navigate = useNavigate();
    const [certificados, setCertificados] = useState<CertificadoDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await CertificadoService.getAll();
            setCertificados(data);
            setError(null);
        } catch (err) {
            setError("Erro ao carregar certificados.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Deseja realmente excluir este certificado?")) {
            try {
                await CertificadoService.delete(id);
                loadData();
            } catch (err) {
                alert("Erro ao excluir certificado.");
            }
        }
    };

    const columns: TableColumn<CertificadoDto>[] = [
        { key: "ID_Certificado", label: "ID" },
        { key: "UsuarioNome", label: "Usuário" },
        { key: "CursoTitulo", label: "Curso" },
        {
            key: "TrilhaTitulo",
            label: "Trilha",
            render: (c) => c.TrilhaTitulo ?? <span className="text-muted">Curso Individual</span>
        },
        {
            key: "CodigoVerificacao",
            label: "Código de Verificação",
            render: (c) => <code className="bg-light p-1 border rounded">{c.CodigoVerificacao}</code>
        },
        {
            key: "DataEmissao",
            label: "Data de Emissão",
            render: (c) => new Date(c.DataEmissao).toLocaleDateString("pt-BR")
        },
        {
            key: "acoes",
            label: "Ações",
            render: (c) => (
                <div className="d-flex gap-2 justify-content-end">
                    <button
                        onClick={() => navigate(AppRoutes.certificados.edit.replace(":id", String(c.id)))}
                        className="btn btn-sm btn-outline-warning"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => handleDelete(c.id)}
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
                <h1 className="h2 text-primary fw-bold mb-0">Certificados Emitidos</h1>
                <Link to={AppRoutes.certificados.create} className="btn btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Cadastrar Certificado
                </Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : (
                <Table columns={columns} data={certificados} emptyMessage="Nenhum certificado emitido." />
            )}
        </div>
    );
}
