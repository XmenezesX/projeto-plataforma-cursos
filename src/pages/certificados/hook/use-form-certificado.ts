import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CertificadoService } from "../../../services/CertificadoService";
import { UsuarioService } from "../../../services/UsuarioService";
import { CursoService } from "../../../services/CursoService";
import { TrilhaService } from "../../../services/TrilhaService";
import { AppRoutes } from "../../../routes/routes";
import type { Usuario } from "../../../model/Usuario";
import type { Curso } from "../../../model/Curso";
import type { Trilha } from "../../../model/Trilha";

export function useFormCertificado(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Usuario: "",
        ID_Curso: "",
        ID_Trilha: "",
        CodigoVerificacao: "",
        DataEmissao: new Date().toISOString().split("T")[0]
    });

    const [users, setUsers] = useState<Usuario[]>([]);
    const [courses, setCourses] = useState<Curso[]>([]);
    const [trails, setTrails] = useState<Trilha[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRelations() {
            try {
                const [userList, courseList, trailList] = await Promise.all([
                    UsuarioService.getAll(),
                    CursoService.getAll(),
                    TrilhaService.getAll()
                ]);
                setUsers(userList);
                setCourses(courseList);
                setTrails(trailList);
            } catch {
                setError("Erro ao carregar usuários, cursos e trilhas.");
            }
        }
        fetchRelations();
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            CertificadoService.getById(id)
                .then((data) => {
                    setValues({
                        ...data,
                        ID_Trilha: data.ID_Trilha ?? "",
                        DataEmissao: data.DataEmissao.split("T")[0]
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar certificado.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const submitValues = {
                ...values,
                ID_Trilha: values.ID_Trilha ? values.ID_Trilha : null
            };
            if (id) {
                await CertificadoService.update(id, {
                    ...submitValues,
                    ID_Certificado: id
                });
            } else {
                await CertificadoService.create(submitValues);
            }
            navigate(AppRoutes.certificados.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar certificado.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, users, courses, trails, loading, error };
}
