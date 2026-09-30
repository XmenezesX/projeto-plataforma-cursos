import { Routes as RoutesDom, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Login from "../pages/login";
import Home from "../pages/home";
import Courses from "../pages/courses";
import CursoForm from "../pages/courses/form";
import Usuarios from "../pages/usuarios";
import UsuarioForm from "../pages/usuarios/form";
import Categorias from "../pages/categorias";
import CategoriaForm from "../pages/categorias/form";
import Modulos from "../pages/modulos";
import ModuloForm from "../pages/modulos/form";
import Aulas from "../pages/aulas";
import AulaForm from "../pages/aulas/form";
import Matriculas from "../pages/matriculas";
import MatriculaForm from "../pages/matriculas/form";
import Progresso from "../pages/progresso";
import ProgressoForm from "../pages/progresso/form";
import Avaliacoes from "../pages/avaliacoes";
import AvaliacaoForm from "../pages/avaliacoes/form";
import Trilhas from "../pages/trilhas";
import TrilhaForm from "../pages/trilhas/form";
import TrilhasCursos from "../pages/trilhas-cursos";
import TrilhaCursoForm from "../pages/trilhas-cursos/form";
import Certificados from "../pages/certificados";
import CertificadoForm from "../pages/certificados/form";
import Planos from "../pages/planos";
import PlanoForm from "../pages/planos/form";
import Assinaturas from "../pages/assinaturas";
import AssinaturaForm from "../pages/assinaturas/form";
import Pagamentos from "../pages/pagamentos";
import PagamentoForm from "../pages/pagamentos/form";
import { AppRoutes } from "./routes";

export default function Routes() {
    return (
        <RoutesDom>
            {/* Rota Pública de Autenticação */}
            <Route path={AppRoutes.login} element={<Login />} />

            {/* Rotas Protegidas - Redirecionam para /login quando não autenticado */}
            <Route element={<ProtectedRoute />}>
                <Route path={AppRoutes.home} element={<Home />} />

                <Route path={AppRoutes.usuarios.index} element={<Usuarios />} />
                <Route path={AppRoutes.usuarios.create} element={<UsuarioForm />} />
                <Route path={AppRoutes.usuarios.edit} element={<UsuarioForm />} />

                <Route path={AppRoutes.categorias.index} element={<Categorias />} />
                <Route path={AppRoutes.categorias.create} element={<CategoriaForm />} />
                <Route path={AppRoutes.categorias.edit} element={<CategoriaForm />} />

                <Route path={AppRoutes.courses.index} element={<Courses />} />
                <Route path={AppRoutes.courses.create} element={<CursoForm />} />
                <Route path={AppRoutes.courses.edit} element={<CursoForm />} />

                <Route path={AppRoutes.modulos.index} element={<Modulos />} />
                <Route path={AppRoutes.modulos.create} element={<ModuloForm />} />
                <Route path={AppRoutes.modulos.edit} element={<ModuloForm />} />

                <Route path={AppRoutes.aulas.index} element={<Aulas />} />
                <Route path={AppRoutes.aulas.create} element={<AulaForm />} />
                <Route path={AppRoutes.aulas.edit} element={<AulaForm />} />

                <Route path={AppRoutes.matriculas.index} element={<Matriculas />} />
                <Route path={AppRoutes.matriculas.create} element={<MatriculaForm />} />
                <Route path={AppRoutes.matriculas.edit} element={<MatriculaForm />} />

                <Route path={AppRoutes.progresso.index} element={<Progresso />} />
                <Route path={AppRoutes.progresso.create} element={<ProgressoForm />} />
                <Route path={AppRoutes.progresso.edit} element={<ProgressoForm />} />

                <Route path={AppRoutes.avaliacoes.index} element={<Avaliacoes />} />
                <Route path={AppRoutes.avaliacoes.create} element={<AvaliacaoForm />} />
                <Route path={AppRoutes.avaliacoes.edit} element={<AvaliacaoForm />} />

                <Route path={AppRoutes.trilhas.index} element={<Trilhas />} />
                <Route path={AppRoutes.trilhas.create} element={<TrilhaForm />} />
                <Route path={AppRoutes.trilhas.edit} element={<TrilhaForm />} />

                <Route path={AppRoutes.trilhasCursos.index} element={<TrilhasCursos />} />
                <Route path={AppRoutes.trilhasCursos.create} element={<TrilhaCursoForm />} />
                <Route path={AppRoutes.trilhasCursos.edit} element={<TrilhaCursoForm />} />

                <Route path={AppRoutes.certificados.index} element={<Certificados />} />
                <Route path={AppRoutes.certificados.create} element={<CertificadoForm />} />
                <Route path={AppRoutes.certificados.edit} element={<CertificadoForm />} />

                <Route path={AppRoutes.planos.index} element={<Planos />} />
                <Route path={AppRoutes.planos.create} element={<PlanoForm />} />
                <Route path={AppRoutes.planos.edit} element={<PlanoForm />} />

                <Route path={AppRoutes.assinaturas.index} element={<Assinaturas />} />
                <Route path={AppRoutes.assinaturas.create} element={<AssinaturaForm />} />
                <Route path={AppRoutes.assinaturas.edit} element={<AssinaturaForm />} />

                <Route path={AppRoutes.pagamentos.index} element={<Pagamentos />} />
                <Route path={AppRoutes.pagamentos.create} element={<PagamentoForm />} />
                <Route path={AppRoutes.pagamentos.edit} element={<PagamentoForm />} />

                <Route path="*" element={<Navigate to={AppRoutes.home} replace />} />
            </Route>
        </RoutesDom>
    );
}