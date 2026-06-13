import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AssinaturaService } from "../../../services/AssinaturaService";
import { UsuarioService } from "../../../services/UsuarioService";
import { PlanoService } from "../../../services/PlanoService";
import { AppRoutes } from "../../../routes/routes";
import type { Usuario } from "../../../model/Usuario";
import type { Plano } from "../../../model/Plano";

export function useFormAssinatura(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Usuario: "",
        ID_Plano: "",
        DataInicio: new Date().toISOString().split("T")[0],
        DataFim: new Date().toISOString().split("T")[0]
    });

    const [users, setUsers] = useState<Usuario[]>([]);
    const [plans, setPlans] = useState<Plano[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRelations() {
            try {
                const [userList, planList] = await Promise.all([
                    UsuarioService.getAll(),
                    PlanoService.getAll()
                ]);
                setUsers(userList);
                setPlans(planList);
            } catch {
                setError("Erro ao carregar usuários e planos.");
            }
        }
        fetchRelations();
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            AssinaturaService.getById(id)
                .then((data) => {
                    setValues({
                        ...data,
                        DataInicio: data.DataInicio.split("T")[0],
                        DataFim: data.DataFim.split("T")[0]
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar assinatura.");
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
                await AssinaturaService.update(id, {
                    ...values,
                    ID_Assinatura: id
                });
            } else {
                await AssinaturaService.create(values);
            }
            navigate(AppRoutes.assinaturas.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar assinatura.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, users, plans, loading, error };
}
