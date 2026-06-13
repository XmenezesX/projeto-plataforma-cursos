import { useParams, Link } from "react-router-dom";
import { useFormUsuario } from "./hook/use-form-usuario";
import { AppRoutes } from "../../routes/routes";

export default function UsuarioForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, loading, error } = useFormUsuario(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Usuário" : "Cadastrar Usuário"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="NomeCompleto" className="form-label">Nome Completo</label>
                    <input
                        type="text"
                        name="NomeCompleto"
                        id="NomeCompleto"
                        className="form-control"
                        value={values.NomeCompleto}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="Email" className="form-label">E-mail</label>
                    <input
                        type="email"
                        name="Email"
                        id="Email"
                        className="form-control"
                        value={values.Email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="SenhaHash" className="form-label">Senha</label>
                    <input
                        type="password"
                        name="SenhaHash"
                        id="SenhaHash"
                        className="form-control"
                        value={values.SenhaHash}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.usuarios.index} className="btn btn-outline-secondary">
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
