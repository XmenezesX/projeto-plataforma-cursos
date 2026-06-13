import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PlanoService } from "../../../services/PlanoService";
import { AppRoutes } from "../../../routes/routes";

export function useFormPlano(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        Nome: "",
        Descricao: "",
        Preco: 0,
        DuracaoMeses: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            PlanoService.getById(id)
                .then((data) => {
                    setValues(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar plano.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let typedValue: any = value;
        if (name === "Preco" || name === "DuracaoMeses") {
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
                await PlanoService.update(id, {
                    ...values,
                    ID_Plano: id
                });
            } else {
                await PlanoService.create(values);
            }
            navigate(AppRoutes.planos.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar plano.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, loading, error };
}
