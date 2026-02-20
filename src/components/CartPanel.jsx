function formatBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function CartPanel({
  items,
  total,
  onIncrement,
  onDecrement,
  onRemove,
  onOpenCheckout,
}) {
  return (
    <aside className="cart-panel">
      <h2>Carrinho</h2>

      {items.length === 0 ? (
        <p className="muted">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {item.quantity} x {formatBRL(item.price)}
                  </small>
                </div>

                <div className="cart-actions">
                  <button type="button" onClick={() => onDecrement(item.id)}>
                    -
                  </button>
                  <button type="button" onClick={() => onIncrement(item.id)}>
                    +
                  </button>
                  <button type="button" onClick={() => onRemove(item.id)}>
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <span>Total</span>
            <strong>{formatBRL(total)}</strong>
          </div>

          <button className="btn-primary" type="button" onClick={onOpenCheckout}>
            Finalizar pedido
          </button>
        </>
      )}
    </aside>
  );
}
