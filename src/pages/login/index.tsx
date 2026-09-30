import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../../services/AuthService";
import { UsuarioService } from "../../services/UsuarioService";
import { AppRoutes } from "../../routes/routes";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redireciona para home se já estiver logado
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      navigate(AppRoutes.home, { replace: true });
    }
  }, [navigate]);

  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || AppRoutes.home;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRegister) {
        // Fluxo de Cadastro
        if (!nomeCompleto || nomeCompleto.trim().length < 3) {
          throw new Error("O nome completo deve conter pelo menos 3 caracteres.");
        }
        if (!password || password.trim().length < 6) {
          throw new Error("A senha deve ter no mínimo 6 caracteres.");
        }

        await UsuarioService.create({
          NomeCompleto: nomeCompleto.trim(),
          Email: email.trim(),
          SenhaHash: password,
        });

        setSuccess("Conta criada com sucesso! Realizando login...");
        // Realiza o login automaticamente
        await AuthService.login({ email: email.trim(), password });
        navigate(from, { replace: true });
      } else {
        // Fluxo de Login
        await AuthService.login({ email: email.trim(), password });
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Ocorreu um erro na autenticação. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div className="card shadow-sm border-0" style={{ maxWidth: "440px", width: "100%" }}>
        <div className="card-body p-4 p-sm-5">
          {/* Cabeçalho */}
          <div className="text-center mb-4">
            <div
              className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
              style={{ width: "64px", height: "64px" }}
            >
              <i className="bi bi-mortarboard-fill fs-2"></i>
            </div>
            <h1 className="h4 fw-bold text-dark mb-1">Plataforma de Cursos</h1>
            <p className="text-muted small">
              {isRegister
                ? "Preencha os campos abaixo para criar sua conta"
                : "Entre com suas credenciais para acessar a plataforma"}
            </p>
          </div>

          {/* Abas Alternadoras */}
          <ul className="nav nav-pills nav-fill mb-4 bg-light p-1 rounded">
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link py-2 ${!isRegister ? "active fw-semibold" : "text-muted"}`}
                onClick={() => {
                  setIsRegister(false);
                  setError(null);
                  setSuccess(null);
                }}
              >
                Entrar
              </button>
            </li>
            <li className="nav-item">
              <button
                type="button"
                className={`nav-link py-2 ${isRegister ? "active fw-semibold" : "text-muted"}`}
                onClick={() => {
                  setIsRegister(true);
                  setError(null);
                  setSuccess(null);
                }}
              >
                Criar Conta
              </button>
            </li>
          </ul>

          {/* Alertas */}
          {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <div className="small">{error}</div>
            </div>
          )}

          {success && (
            <div className="alert alert-success d-flex align-items-center gap-2 mb-3" role="alert">
              <i className="bi bi-check-circle-fill"></i>
              <div className="small">{success}</div>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="mb-3">
                <label htmlFor="nomeCompleto" className="form-label small fw-semibold">
                  Nome Completo
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <i className="bi bi-person text-muted"></i>
                  </span>
                  <input
                    type="text"
                    id="nomeCompleto"
                    className="form-control border-start-0 ps-0"
                    placeholder="Seu nome completo"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="form-label small fw-semibold">
                E-mail
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-envelope text-muted"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label small fw-semibold">
                Senha
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-lock text-muted"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Processando...
                </>
              ) : isRegister ? (
                <>
                  <i className="bi bi-person-plus-fill"></i>
                  Cadastrar e Acessar
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Acessar Plataforma
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
