import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AulaService } from "../../../services/AulaService";
import { ModuloService } from "../../../services/ModuloService";
import { AppRoutes } from "../../../routes/routes";
import type { Modulo } from "../../../model/Modulo";
import type { TipoConteudoAula } from "../../../model/Aula";

export function useFormAula(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Modulo: "",
        Titulo: "",
        TipoConteudo: "Vídeo" as TipoConteudoAula,
        URL_Conteudo: "",
        DuracaoMinutos: 0,
        Ordem: 1
    });

    const [modules, setModules] = useState<Modulo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        ModuloService.getAll()
            .then(setModules)
            .catch(() => setError("Erro ao carregar módulos."));
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            AulaService.getById(id)
                .then((data) => {
                    setValues(data);
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar aula.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let typedValue: any = value;
        if (name === "DuracaoMinutos" || name === "Ordem") {
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
                await AulaService.update(id, {
                    ...values,
                    ID_Aula: id
                });
            } else {
                await AulaService.create(values);
            }
            navigate(AppRoutes.aulas.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar aula.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, modules, loading, error };
}
