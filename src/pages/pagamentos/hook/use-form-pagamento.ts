import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PagamentoService } from "../../../services/PagamentoService";
import { AssinaturaService } from "../../../services/AssinaturaService";
import { AppRoutes } from "../../../routes/routes";
import type { Assinatura } from "../../../model/Assinatura";

export function useFormPagamento(id?: string) {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        ID_Assinatura: "",
        ValorPago: 0,
        DataPagamento: new Date().toISOString().split("T")[0],
        MetodoPagamento: "Pix",
        Id_Transacao_Gateway: "",
        DataFim: new Date().toISOString().split("T")[0]
    });

    const [subscriptions, setSubscriptions] = useState<Assinatura[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        AssinaturaService.getAll()
            .then(setSubscriptions)
            .catch(() => setError("Erro ao carregar assinaturas."));
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true);
            PagamentoService.getById(id)
                .then((data) => {
                    setValues({
                        ...data,
                        DataPagamento: data.DataPagamento.split("T")[0],
                        DataFim: data.DataFim.split("T")[0]
                    });
                    setLoading(false);
                })
                .catch(() => {
                    setError("Erro ao carregar pagamento.");
                    setLoading(false);
                });
        }
    }, [id]);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        
        let typedValue: any = value;
        if (name === "ValorPago") {
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
                await PagamentoService.update(id, {
                    ...values,
                    ID_Pagamento: id
                });
            } else {
                await PagamentoService.create(values);
            }
            navigate(AppRoutes.pagamentos.index);
        } catch (err: any) {
            setError(err.message || "Erro ao salvar pagamento.");
            setLoading(false);
        }
    };

    return { values, handleChange, handleSubmit, subscriptions, loading, error };
}
