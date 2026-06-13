import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MatriculaService } from "../../../services/MatriculaService";
import { UsuarioService } from "../../../services/UsuarioService";
import { CursoService } from "../../../services/CursoService";
import { AppRoutes } from "../../../routes/routes";
import type { Usuario } from "../../../model/Usuario";
import type { Curso } from "../../../model/Curso";

export function useFormMatricula(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Usuario: "",
        ID_Curso: "",
        DataMatricula: new Date().toISOString().split("T")[0],
        DataConclusao: ""
    });

    const [users, setUsers] = useState<Usuario[]>([]);
    const [courses, setCourses] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRelations() {
            try {
                const [userList, courseList] = await Promise.all([
                    UsuarioService.getAll(),
                    CursoService.getAll()
                ]);
                setUsers(userList);
                setCourses(courseList);
            } catch {
                setError("Erro ao carregar usuários e cursos.");
            }
        }
        fetchRelations();
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            MatriculaService.getById(id)
                .then((data) => {
                    setValues({
                        ...data,
                        DataMatricula: data.DataMatricula.split("T")[0],
                        DataConclusao: data.DataConclusao ? data.DataConclusao.split("T")[0] : ""
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar matrícula.");
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
                DataConclusao: values.DataConclusao ? values.DataConclusao : null
            };
            if (id) {
                await MatriculaService.update(id, {
                    ...submitValues,
                    ID_Matricula: id
                });
            } else {
                await MatriculaService.create(submitValues);
            }
            navigate(AppRoutes.matriculas.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar matrícula.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, users, courses, loading, error };
}
