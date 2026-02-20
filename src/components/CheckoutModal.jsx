import { useMemo, useState } from "react";

function toOrderProducts(items) {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unitPrice: item.price,
    subtotal: Number(item.price) * Number(item.quantity),
  }));
}

export default function CheckoutModal({ isOpen, items, total, onClose, onSubmit }) {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    deliveryType: "entrega",
    address: "",
    complement: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const orderProducts = useMemo(() => toOrderProducts(items), [items]);

  if (!isOpen) return null;

  async function handleConfirm(e) {
    e.preventDefault();
    setError("");

    if (!form.customerName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Informe o telefone.");
      return;
    }

    if (form.deliveryType === "entrega" && !form.address.trim()) {
      setError("Informe o endereço para entrega.");
      return;
    }

    setSaving(true);
    try {
      await onSubmit({
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        deliveryType: form.deliveryType,
        address: form.deliveryType === "entrega" ? form.address.trim() : "",
        complement: form.deliveryType === "entrega" ? form.complement.trim() : "",
        products: orderProducts,
        total,
      });

      setForm({
        customerName: "",
        phone: "",
        deliveryType: "entrega",
        address: "",
        complement: "",
      });
      onClose();
    } catch (err) {
      setError("Falha ao enviar pedido. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="modal-backdrop"
      onClick={() => {
        if (!saving) onClose();
      }}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Finalizar pedido</h2>

        <form onSubmit={handleConfirm} className="checkout-form">
          <label>
            Nome
            <input
              value={form.customerName}
              onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
            />
          </label>

          <label>
            Telefone
            <input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </label>

          <fieldset>
            <legend>Tipo de entrega</legend>
            <label className="inline">
              <input
                type="radio"
                name="deliveryType"
                value="entrega"
                checked={form.deliveryType === "entrega"}
                onChange={(e) => setForm((p) => ({ ...p, deliveryType: e.target.value }))}
              />
              Entrega
            </label>
            <label className="inline">
              <input
                type="radio"
                name="deliveryType"
                value="retirada"
                checked={form.deliveryType === "retirada"}
                onChange={(e) => setForm((p) => ({ ...p, deliveryType: e.target.value }))}
              />
              Retirada no local
            </label>
          </fieldset>

          {form.deliveryType === "entrega" && (
            <>
              <label>
                Endereço
                <input
                  value={form.address}
                  onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                />
              </label>

              <label>
                Complemento (opcional)
                <input
                  value={form.complement}
                  onChange={(e) => setForm((p) => ({ ...p, complement: e.target.value }))}
                />
              </label>
            </>
          )}

          {error && <p className="error-text">{error}</p>}

          <div className="checkout-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancelar
            </button>
            <button className="btn-primary" type="submit" disabled={saving}>
              {saving ? "Enviando..." : "Confirmar pedido"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
