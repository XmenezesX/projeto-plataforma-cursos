import { UsuarioService } from "../../../services/UsuarioService";
import { CursoService } from "../../../services/CursoService";
import { MatriculaService } from "../../../services/MatriculaService";
import { CertificadoService } from "../../../services/CertificadoService";
import { useEffect, useState } from "react";

export default function useFormHome() {
    const [homeInfo, setHomeInfo] = useState({
        usuarios: 0,
        cursos: 0,
        matriculas: 0,
        certificados: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadData() {
            try {
                const [usuarios, cursos, matriculas, certificados] = await Promise.all([
                    UsuarioService.getAll(),
                    CursoService.getAll(),
                    MatriculaService.getAll(),
                    CertificadoService.getAll(),
                ]);

                if (isMounted) {
                    setHomeInfo({
                        usuarios: usuarios.length,
                        cursos: cursos.length,
                        matriculas: matriculas.length,
                        certificados: certificados.length,
                    });
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    setError("Erro ao carregar os dados da plataforma. Verifique se a API está rodando.");
                    setLoading(false);
                    console.error(err);
                }
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    return { homeInfo, loading, error };
}