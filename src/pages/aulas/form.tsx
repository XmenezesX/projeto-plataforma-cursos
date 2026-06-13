import { useParams, Link } from "react-router-dom";
import { useFormAula } from "./hook/use-form-aula";
import { AppRoutes } from "../../routes/routes";

export default function AulaForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, modules, loading, error } = useFormAula(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Aula" : "Cadastrar Aula"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="ID_Modulo" className="form-label">Módulo</label>
                    <select
                        name="ID_Modulo"
                        id="ID_Modulo"
                        className="form-select"
                        value={values.ID_Modulo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {modules.map((m) => (
                            <option key={m.ID_Modulo} value={m.ID_Modulo}>
                                {m.Titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="Titulo" className="form-label">Título da Aula</label>
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

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="TipoConteudo" className="form-label">Tipo de Conteúdo</label>
                        <select
                            name="TipoConteudo"
                            id="TipoConteudo"
                            className="form-select"
                            value={values.TipoConteudo}
                            onChange={handleChange}
                            required
                        >
                            <option value="Vídeo">Vídeo</option>
                            <option value="Texto">Texto</option>
                            <option value="Quiz">Quiz</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="DuracaoMinutos" className="form-label">Duração (Minutos)</label>
                        <input
                            type="number"
                            name="DuracaoMinutos"
                            id="DuracaoMinutos"
                            className="form-control"
                            min="1"
                            value={values.DuracaoMinutos}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="URL_Conteudo" className="form-label">URL do Conteúdo</label>
                    <input
                        type="url"
                        name="URL_Conteudo"
                        id="URL_Conteudo"
                        className="form-control"
                        value={values.URL_Conteudo}
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
                    <Link to={AppRoutes.aulas.index} className="btn btn-outline-secondary">
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
