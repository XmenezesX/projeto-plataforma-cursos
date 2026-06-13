import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { TrilhaService } from "../../../services/TrilhaService";
import { CategoriaService } from "../../../services/CategoriaService";
import { AppRoutes } from "../../../routes/routes";
import type { Categoria } from "../../../model/Categoria";

export function useFormTrilha(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        Titulo: "",
        Descricao: "",
        ID_Categoria: ""
    });

    const [categories, setCategories] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        CategoriaService.getAll()
            .then(setCategories)
            .catch(() => setError("Erro ao carregar categorias."));
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            TrilhaService.getById(id)
                .then((data) => {
                    setValues(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar trilha.");
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
            if (id) {
                await TrilhaService.update(id, {
                    ...values,
                    ID_Trilha: id
                });
            } else {
                await TrilhaService.create(values);
            }
            navigate(AppRoutes.trilhas.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar trilha.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, categories, loading, error };
}
