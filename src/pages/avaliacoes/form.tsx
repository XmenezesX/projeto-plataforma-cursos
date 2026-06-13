import { useParams, Link } from "react-router-dom";
import { useFormAvaliacao } from "./hook/use-form-avaliacao";
import { AppRoutes } from "../../routes/routes";

export default function AvaliacaoForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, users, courses, loading, error } = useFormAvaliacao(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Avaliação" : "Cadastrar Avaliação"}
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

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="Nota" className="form-label">Nota (1 a 5)</label>
                        <select
                            name="Nota"
                            id="Nota"
                            className="form-select"
                            value={values.Nota}
                            onChange={handleChange}
                            required
                        >
                            <option value={1}>1 Estrela</option>
                            <option value={2}>2 Estrelas</option>
                            <option value={3}>3 Estrelas</option>
                            <option value={4}>4 Estrelas</option>
                            <option value={5}>5 Estrelas</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="DataAvaliacao" className="form-label">Data da Avaliação</label>
                        <input
                            type="date"
                            name="DataAvaliacao"
                            id="DataAvaliacao"
                            className="form-control"
                            value={values.DataAvaliacao}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="Comentario" className="form-label">Comentário</label>
                    <textarea
                        name="Comentario"
                        id="Comentario"
                        className="form-control"
                        rows={3}
                        value={values.Comentario || ""}
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.avaliacoes.index} className="btn btn-outline-secondary">
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
