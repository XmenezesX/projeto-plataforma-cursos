import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CursoService } from "../../../services/CursoService";
import { UsuarioService } from "../../../services/UsuarioService";
import { CategoriaService } from "../../../services/CategoriaService";
import { AppRoutes } from "../../../routes/routes";
import type { Usuario } from "../../../model/Usuario";
import type { Categoria } from "../../../model/Categoria";
import type { NivelCurso } from "../../../model/Curso";

export function useFormCurso(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        Titulo: "",
        Descricao: "",
        ID_Instrutor: "",
        ID_Categoria: "",
        Nivel: "Iniciante" as NivelCurso,
        DataPublicacao: new Date().toISOString().split("T")[0],
        TotalAulas: 0,
        TotalHoras: 0
    });
    
    const [instructors, setInstructors] = useState<Usuario[]>([]);
    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRelations() {
            try {
                const [instList, catList] = await Promise.all([
                    UsuarioService.getAll(),
                    CategoriaService.getAll()
                ]);
                setInstructors(instList);
                setCategories(catList);
            } catch {
                setError("Erro ao carregar instrutores e categorias.");
            }
        }
        fetchRelations();
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            CursoService.getById(id)
                .then((data) => {
                    setValues({
                        ...data,
                        DataPublicacao: data.DataPublicacao.split("T")[0]
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar curso.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let typedValue: any = value;
        if (name === "TotalAulas" || name === "TotalHoras") {
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
                await CursoService.update(id, {
                    ...values,
                    ID_Curso: id
                });
            } else {
                await CursoService.create(values);
            }
            navigate(AppRoutes.courses.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar curso.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, instructors, categories, loading, error };
}
