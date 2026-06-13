import { useParams, Link } from "react-router-dom";
import { useFormProgresso } from "./hook/use-form-progresso";
import { AppRoutes } from "../../routes/routes";

export default function ProgressoForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, users, aulas, loading, error } = useFormProgresso(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Progresso" : "Cadastrar Progresso"}
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
                    <label htmlFor="ID_Aula" className="form-label">Aula</label>
                    <select
                        name="ID_Aula"
                        id="ID_Aula"
                        className="form-select"
                        value={values.ID_Aula}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {aulas.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.Titulo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="Status" className="form-label">Status</label>
                        <select
                            name="Status"
                            id="Status"
                            className="form-select"
                            value={values.Status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Iniciado">Iniciado</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Concluído">Concluído</option>
                        </select>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="DataConclusao" className="form-label">Data de Conclusão</label>
                        <input
                            type="date"
                            name="DataConclusao"
                            id="DataConclusao"
                            className="form-control"
                            value={values.DataConclusao}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.progresso.index} className="btn btn-outline-secondary">
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
