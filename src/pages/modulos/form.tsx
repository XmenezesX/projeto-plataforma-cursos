import { useParams, Link } from "react-router-dom";
import { useFormModulo } from "./hook/use-form-modulo";
import { AppRoutes } from "../../routes/routes";

export default function ModuloForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, courses, loading, error } = useFormModulo(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Módulo" : "Cadastrar Módulo"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
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
                    <label htmlFor="Titulo" className="form-label">Título do Módulo</label>
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
                    <label htmlFor="Ordem" className="form-label">Ordem</label>
                    <input
                        type="number"
                        name="Ordem"
                        id="Ordem"
                        className="form-control"
                        min="1"
                        value={values.Ordem}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.modulos.index} className="btn btn-outline-secondary">
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
