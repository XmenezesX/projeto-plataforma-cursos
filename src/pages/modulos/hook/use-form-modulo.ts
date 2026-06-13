import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ModuloService } from "../../../services/ModuloService";
import { CursoService } from "../../../services/CursoService";
import { AppRoutes } from "../../../routes/routes";
import type { Curso } from "../../../model/Curso";

export function useFormModulo(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Curso: "",
        Titulo: "",
        Ordem: 1
    });

    const [courses, setCourses] = useState<Curso[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        CursoService.getAll()
            .then(setCourses)
            .catch(() => setError("Erro ao carregar cursos."));
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            ModuloService.getById(id)
                .then((data) => {
                    setValues(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar módulo.");
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
                await ModuloService.update(id, {
                    ...values,
                    ID_Modulo: id
                });
            } else {
                await ModuloService.create(values);
            }
            navigate(AppRoutes.modulos.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar módulo.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, courses, loading, error };
}
