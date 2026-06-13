import { useParams, Link } from "react-router-dom";
import { useFormPlano } from "./hook/use-form-plano";
import { AppRoutes } from "../../routes/routes";

export default function PlanoForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, loading, error } = useFormPlano(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Plano" : "Cadastrar Plano"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="Nome" className="form-label">Nome do Plano</label>
                    <input
                        type="text"
                        name="Nome"
                        id="Nome"
                        className="form-control"
                        value={values.Nome}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Descricao" className="form-label">Descrição</label>
                    <textarea
                        name="Descricao"
                        id="Descricao"
                        className="form-control"
                        rows={3}
                        value={values.Descricao}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="Preco" className="form-label">Preço</label>
                        <input
                            type="number"
                            name="Preco"
                            id="Preco"
                            className="form-control"
                            step="0.01"
                            min="0"
                            value={values.Preco}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="DuracaoMeses" className="form-label">Duração (Meses)</label>
                        <input
                            type="number"
                            name="DuracaoMeses"
                            id="DuracaoMeses"
                            className="form-control"
                            min="1"
                            value={values.DuracaoMeses}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.planos.index} className="btn btn-outline-secondary">
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
