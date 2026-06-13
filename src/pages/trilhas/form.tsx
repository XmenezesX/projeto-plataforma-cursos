import { useParams, Link } from "react-router-dom";
import { useFormTrilha } from "./hook/use-form-trilha";
import { AppRoutes } from "../../routes/routes";

export default function TrilhaForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, categories, loading, error } = useFormTrilha(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Trilha" : "Cadastrar Trilha"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="Titulo" className="form-label">Título da Trilha</label>
                    <input
                        type="text"
                        name="Titulo"
                        id="Titulo"
                        className="form-control"
                        value={values.Titulo}
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

                <div className="mb-3">
                    <label htmlFor="ID_Categoria" className="form-label">Categoria</label>
                    <select
                        name="ID_Categoria"
                        id="ID_Categoria"
                        className="form-select"
                        value={values.ID_Categoria}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.Nome}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.trilhas.index} className="btn btn-outline-secondary">
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
