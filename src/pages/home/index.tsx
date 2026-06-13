import Card from "../../components/card";
import useFormHome from "./hook/use-form-home";

export default function Home() {
    const { homeInfo, loading, error } = useFormHome();

    return (
        <div className="container mt-5">
            <div className="row mb-4">
                <div className="col-md-12">
                    <h1 className="display-4 fw-bold text-primary">Bem-vindo à plataforma de cursos!</h1>
                    <p className="lead text-muted">Explore nossos cursos e comece a aprender hoje mesmo.</p>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger role-alert d-flex align-items-center mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                </div>
            )}

            <div className="row g-4">
                <div className="col-sm-6 col-md-3">
                    <Card
                        title="Usuários"
                        iconTitle="bi bi-people"
                        description={loading ? "Carregando..." : `Quantidade: ${homeInfo.usuarios}`}
                        link=""
                    />
                </div>

                <div className="col-sm-6 col-md-3">
                    <Card
                        title="Cursos"
                        iconTitle="bi bi-book"
                        description={loading ? "Carregando..." : `Quantidade: ${homeInfo.cursos}`}
                        link=""
                    />
                </div>

                <div className="col-sm-6 col-md-3">
                    <Card
                        title="Matrículas"
                        iconTitle="bi bi-clipboard"
                        description={loading ? "Carregando..." : `Quantidade: ${homeInfo.matriculas}`}
                        link=""
                    />
                </div>

                <div className="col-sm-6 col-md-3">
                    <Card
                        title="Certificados Lançados"
                        iconTitle="bi bi-patch-check"
                        description={loading ? "Carregando..." : `Quantidade: ${homeInfo.certificados}`}
                        link=""
                    />
                </div>
            </div>
        </div>
    );
}