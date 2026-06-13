import { useParams, Link } from "react-router-dom";
import { useFormCurso } from "./hook/use-form-curso";
import { AppRoutes } from "../../routes/routes";

export default function CursoForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, instructors, categories, loading, error } = useFormCurso(id);

    return (
        <div className="container" style={{ maxWidth: "650px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Curso" : "Cadastrar Curso"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="Titulo" className="form-label">Título do Curso</label>
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

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="ID_Instrutor" className="form-label">Instrutor</label>
                        <select
                            name="ID_Instrutor"
                            id="ID_Instrutor"
                            className="form-select"
                            value={values.ID_Instrutor}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione...</option>
                            {instructors.map((inst) => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.NomeCompleto}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
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
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.Nome}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="Nivel" className="form-label">Nível</label>
                        <select
                            name="Nivel"
                            id="Nivel"
                            className="form-select"
                            value={values.Nivel}
                            onChange={handleChange}
                            required
                        >
                            <option value="Iniciante">Iniciante</option>
                            <option value="Intermediário">Intermediário</option>
                            <option value="Avançado">Avançado</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="DataPublicacao" className="form-label">Data de Publicação</label>
                        <input
                            type="date"
                            name="DataPublicacao"
                            id="DataPublicacao"
                            className="form-control"
                            value={values.DataPublicacao}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="TotalAulas" className="form-label">Total de Aulas</label>
                        <input
                            type="number"
                            name="TotalAulas"
                            id="TotalAulas"
                            className="form-control"
                            min="0"
                            value={values.TotalAulas}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="TotalHoras" className="form-label">Total de Horas</label>
                        <input
                            type="number"
                            name="TotalHoras"
                            id="TotalHoras"
                            className="form-control"
                            min="0"
                            value={values.TotalHoras}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.courses.index} className="btn btn-outline-secondary">
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
