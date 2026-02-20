const STATUSES = [
  "pendente",
  "em preparo",
  "saiu para entrega",
  "finalizado",
];

function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function OrderCard({ order, onChangeStatus }) {
  return (
    <article className="order-card">
      <header>
        <h3>{order.customerName || "Sem nome"}</h3>
        <span className="status">{order.status || "pendente"}</span>
      </header>

      <p>
        <strong>Telefone:</strong> {order.phone}
      </p>
      <p>
        <strong>Tipo:</strong> {order.deliveryType === "retirada" ? "Retirada" : "Entrega"}
      </p>

      {order.deliveryType === "entrega" && (
        <p>
          <strong>Endereço:</strong> {order.address || "-"}
          {order.complement ? ` (${order.complement})` : ""}
        </p>
      )}

      <div>
        <strong>Produtos:</strong>
        <ul>
          {(order.products || []).map((p) => (
            <li key={`${order.id}-${p.id}`}>
              {p.name} - {p.quantity}x - {formatBRL(p.subtotal)}
            </li>
          ))}
        </ul>
      </div>

      <p>
        <strong>Total:</strong> {formatBRL(order.total)}
      </p>

      <div className="status-actions">
        {STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            className={order.status === status ? "active" : ""}
            onClick={() => onChangeStatus(order, status)}
          >
            {status}
          </button>
        ))}
      </div>
    </article>
  );
}
