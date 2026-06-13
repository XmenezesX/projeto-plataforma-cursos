import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressoAulaService } from "../../../services/ProgressoAulaService";
import { UsuarioService } from "../../../services/UsuarioService";
import { AulaService } from "../../../services/AulaService";
import { AppRoutes } from "../../../routes/routes";
import type { Usuario } from "../../../model/Usuario";
import type { Aula } from "../../../model/Aula";
import type { StatusProgresso } from "../../../model/ProgressoAula";

export function useFormProgresso(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Usuario: "",
        ID_Aula: "",
        DataConclusao: new Date().toISOString().split("T")[0],
        Status: "Iniciado" as StatusProgresso
    });

    const [users, setUsers] = useState<Usuario[]>([]);
    const [aulas, setAulas] = useState<Aula[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRelations() {
            try {
                const [userList, aulaList] = await Promise.all([
                    UsuarioService.getAll(),
                    AulaService.getAll()
                ]);
                setUsers(userList);
                setAulas(aulaList);
            } catch {
                setError("Erro ao carregar usuários e aulas.");
            }
        }
        fetchRelations();
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            ProgressoAulaService.getById(id)
                .then((data) => {
                    setValues({
                        ...data,
                        DataConclusao: data.DataConclusao ? data.DataConclusao.split("T")[0] : ""
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar progresso.");
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
                await ProgressoAulaService.update(id, {
                    ...values,
                    id
                });
            } else {
                await ProgressoAulaService.create(values);
            }
            navigate(AppRoutes.progresso.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar progresso.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, users, aulas, loading, error };
}
