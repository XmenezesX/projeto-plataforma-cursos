import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { TrilhaCursoService } from "../../../services/TrilhaCursoService";
import { TrilhaService } from "../../../services/TrilhaService";
import { CursoService } from "../../../services/CursoService";
import { AppRoutes } from "../../../routes/routes";
import type { Trilha } from "../../../model/Trilha";
import type { Curso } from "../../../model/Curso";

export function useFormTrilhaCurso(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Trilha: "",
        ID_Curso: "",
        Ordem: 1
    });

    const [trails, setTrails] = useState<Trilha[]>([]);
    const [courses, setCourses] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRelations() {
            try {
                const [trailList, courseList] = await Promise.all([
                    TrilhaService.getAll(),
                    CursoService.getAll()
                ]);
                setTrails(trailList);
                setCourses(courseList);
            } catch {
                setError("Erro ao carregar trilhas e cursos.");
            }
        }
        fetchRelations();
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            TrilhaCursoService.getById(id)
                .then((data) => {
                    setValues(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar associação de trilha e curso.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let typedValue: any = value;
        if (name === "Ordem") {
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
                await TrilhaCursoService.update(id, {
                    ...values,
                    id
                });
            } else {
                await TrilhaCursoService.create(values);
            }
            navigate(AppRoutes.trilhasCursos.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar associação.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, trails, courses, loading, error };
}
