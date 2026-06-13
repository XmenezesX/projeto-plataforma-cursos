import { useParams, Link } from "react-router-dom";
import { useFormPagamento } from "./hook/use-form-pagamento";
import { AppRoutes } from "../../routes/routes";

export default function PagamentoForm() {
    const { id } = useParams<{ id: string }>();
    const isEdit = !!id;
    const { values, handleChange, handleSubmit, subscriptions, loading, error } = useFormPagamento(id);

    return (
        <div className="container" style={{ maxWidth: "600px" }}>
            <h1 className="h2 text-primary fw-bold mb-4">
                {isEdit ? "Editar Pagamento" : "Cadastrar Pagamento"}
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="card p-4 shadow-sm bg-white">
                <div className="mb-3">
                    <label htmlFor="ID_Assinatura" className="form-label">Assinatura</label>
                    <select
                        name="ID_Assinatura"
                        id="ID_Assinatura"
                        className="form-select"
                        value={values.ID_Assinatura}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione...</option>
                        {subscriptions.map((s) => (
                            <option key={s.id} value={s.id}>
                                ID: {s.id} (Usuário: {s.ID_Usuario})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="ValorPago" className="form-label">Valor Pago</label>
                        <input
                            type="number"
                            name="ValorPago"
                            id="ValorPago"
                            className="form-control"
                            step="0.01"
                            min="0"
                            value={values.ValorPago}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="MetodoPagamento" className="form-label">Método de Pagamento</label>
                        <select
                            name="MetodoPagamento"
                            id="MetodoPagamento"
                            className="form-select"
                            value={values.MetodoPagamento}
                            onChange={handleChange}
                            required
                        >
                            <option value="Pix">Pix</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Boleto">Boleto</option>
                        </select>
                    </div>
                </div>

                <div className="mb-3">
                    <label htmlFor="Id_Transacao_Gateway" className="form-label">ID Transação Gateway</label>
                    <input
                        type="text"
                        name="Id_Transacao_Gateway"
                        id="Id_Transacao_Gateway"
                        className="form-control"
                        value={values.Id_Transacao_Gateway}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="DataPagamento" className="form-label">Data de Pagamento</label>
                        <input
                            type="date"
                            name="DataPagamento"
                            id="DataPagamento"
                            className="form-control"
                            value={values.DataPagamento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="DataFim" className="form-label">Data de Fim</label>
                        <input
                            type="date"
                            name="DataFim"
                            id="DataFim"
                            className="form-control"
                            value={values.DataFim}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                    <Link to={AppRoutes.pagamentos.index} className="btn btn-outline-secondary">
                        Cancelar
                    </Link>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
