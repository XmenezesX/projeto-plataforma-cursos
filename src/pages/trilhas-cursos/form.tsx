import { useParams, Link } from "react-router-dom";
import { useFormTrilhaCurso } from "./hook/use-form-trilha-curso";
import { AppRoutes } from "../../routes/routes";

export default function TrilhaCursoForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, trails, courses, loading, error } = useFormTrilhaCurso(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Associação de Trilha/Curso" : "Associar Curso à Trilha"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="ID_Trilha" className="form-label">Trilha</label>
                    <select
                        name="ID_Trilha"
                        id="ID_Trilha"
                        className="form-select"
                        value={values.ID_Trilha}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {trails.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.Titulo}
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
                    <Link to={AppRoutes.trilhasCursos.index} className="btn btn-outline-secondary">
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
