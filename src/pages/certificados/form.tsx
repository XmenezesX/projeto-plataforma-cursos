import { useParams, Link } from "react-router-dom";
import { useFormCertificado } from "./hook/use-form-certificado";
import { AppRoutes } from "../../routes/routes";

export default function CertificadoForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, users, courses, trails, loading, error } = useFormCertificado(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Certificado" : "Cadastrar Certificado"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="ID_Usuario" className="form-label">Usuário</label>
                    <select
                        name="ID_Usuario"
                        id="ID_Usuario"
                        className="form-select"
                        value={values.ID_Usuario}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.NomeCompleto}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="ID_Curso" className="form-label">Curso</label>
                    <select
                        name="ID_Curso"
                        id="ID_Curso"
                        className="form-select"
                        value={values.ID_Curso}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.Titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="ID_Trilha" className="form-label">Trilha (Opcional)</label>
                    <select
                        name="ID_Trilha"
                        id="ID_Trilha"
                        className="form-select"
                        value={values.ID_Trilha}
                        onChange={handleChange}
                    >
                        <option value={0}>Nenhuma (Curso Individual)</option>
                        {trails.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.Titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="CodigoVerificacao" className="form-label">Código de Verificação</label>
                        <input
                            type="text"
                            name="CodigoVerificacao"
                            id="CodigoVerificacao"
                            className="form-control"
                            value={values.CodigoVerificacao}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="DataEmissao" className="form-label">Data de Emissão</label>
                        <input
                            type="date"
                            name="DataEmissao"
                            id="DataEmissao"
                            className="form-control"
                            value={values.DataEmissao}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.certificados.index} className="btn btn-outline-secondary">
                        Cancelar
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
