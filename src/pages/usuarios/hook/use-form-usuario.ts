import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { UsuarioService } from "../../../services/UsuarioService";
import { AppRoutes } from "../../../routes/routes";

export function useFormUsuario(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        NomeCompleto: "",
        Email: "",
        SenhaHash: "",
        DataCadastro: new Date().toISOString()
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            setLoading(true);
            UsuarioService.getById(id)
                .then((data) => {
                    setValues(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar usuário.");
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
                await UsuarioService.update(id, {
                    ...values,
                    ID_Usuario: id
                });
            } else {
                await UsuarioService.create(values);
            }
            navigate(AppRoutes.usuarios.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar usuário.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, loading, error };
}
