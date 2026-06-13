import { useParams, Link } from "react-router-dom";
import { useFormCategoria } from "./hook/use-form-categoria";
import { AppRoutes } from "../../routes/routes";

export default function CategoriaForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, loading, error } = useFormCategoria(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Categoria" : "Cadastrar Categoria"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="Nome" className="form-label">Nome</label>
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

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.categorias.index} className="btn btn-outline-secondary">
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
