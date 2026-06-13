import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CategoriaService } from "../../../services/CategoriaService";
import { AppRoutes } from "../../../routes/routes";

export function useFormCategoria(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        Nome: "",
        Descricao: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            CategoriaService.getById(id)
                .then((data) => {
                    setValues(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar categoria.");
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
                await CategoriaService.update(id, {
                    ...values,
                    ID_Categoria: id
                });
            } else {
                await CategoriaService.create(values);
            }
            navigate(AppRoutes.categorias.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar categoria.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, loading, error };
}
