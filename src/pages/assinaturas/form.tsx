import { useParams, Link } from "react-router-dom";
import { useFormAssinatura } from "./hook/use-form-assinatura";
import { AppRoutes } from "../../routes/routes";

export default function AssinaturaForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, users, plans, loading, error } = useFormAssinatura(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Assinatura" : "Cadastrar Assinatura"}
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
                            <option key={u.ID_Usuario} value={u.ID_Usuario}>
                                {u.NomeCompleto}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="ID_Plano" className="form-label">Plano</label>
                    <select
                        name="ID_Plano"
                        id="ID_Plano"
                        className="form-select"
                        value={values.ID_Plano}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {plans.map((p) => (
                            <option key={p.ID_Plano} value={p.ID_Plano}>
                                {p.Nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="DataInicio" className="form-label">Data de Início</label>
                        <input
                            type="date"
                            name="DataInicio"
                            id="DataInicio"
                            className="form-control"
                            value={values.DataInicio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="DataFim" className="form-label">Data de Fim</label>
                        <input
                            type="date"
                            name="DataFim"
                            id="DataFim"
                            className="form-control"
                            value={values.DataFim}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.assinaturas.index} className="btn btn-outline-secondary">
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
