import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AvaliacaoService } from "../../../services/AvaliacaoService";
import { UsuarioService } from "../../../services/UsuarioService";
import { CursoService } from "../../../services/CursoService";
import { AppRoutes } from "../../../routes/routes";
import type { Usuario } from "../../../model/Usuario";
import type { Curso } from "../../../model/Curso";

export function useFormAvaliacao(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Usuario: "",
        ID_Curso: "",
        Nota: 5,
        Comentario: "",
        DataAvaliacao: new Date().toISOString().split("T")[0]
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
            AvaliacaoService.getById(id)
                .then((data) => {
                    setValues({
                        ...data,
                        Comentario: data.Comentario ?? "",
                        DataAvaliacao: data.DataAvaliacao.split("T")[0]
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar avaliação.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let typedValue: any = value;
        if (name === "Nota") {
            typedValue = Number(value);
        }

        setValues((prev) => ({ ...prev, [name]: typedValue }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (id) {
                await AvaliacaoService.update(id, {
                    ...values,
                    ID_Avaliacao: id
                });
            } else {
                await AvaliacaoService.create(values);
            }
            navigate(AppRoutes.avaliacoes.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar avaliação.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, users, courses, loading, error };
}
