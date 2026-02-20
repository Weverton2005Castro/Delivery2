export default function ProductCard({ product, onAdd }) {
  return (
    <article className="card">
      <img
        className="card-image"
        src={product.image || "/placeholders/fallback.svg"}
        alt={product.name}
        onError={(e) => {
          if (e.currentTarget.dataset.fallbackApplied === "1") return;
          e.currentTarget.dataset.fallbackApplied = "1";
          e.currentTarget.src = "/placeholders/fallback.svg";
        }}
      />
      <div className="card-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="card-footer">
          <strong>R$ {Number(product.price).toFixed(2)}</strong>
          <button type="button" onClick={() => onAdd(product)}>
            Adicionar
          </button>
        </div>
      </div>
    </article>
  );
}
