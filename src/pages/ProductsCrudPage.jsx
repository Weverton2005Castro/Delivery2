import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  ensureProductsSeeded,
  getProducts,
  updateProduct,
} from "../services/productsService";
import "./products-crud.css";

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  image: "",
};

function toFormValues(product) {
  return {
    name: product.name || "",
    description: product.description || "",
    price: String(product.price ?? ""),
    image: product.image || "",
  };
}

function validateForm(form) {
  const name = form.name.trim();
  const description = form.description.trim();
  const image = form.image.trim();
  const price = Number(form.price);

  if (!name || !description || !image || Number.isNaN(price) || price <= 0) {
    return null;
  }

  return { name, description, image, price };
}

export default function ProductsCrudPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [newForm, setNewForm] = useState(EMPTY_FORM);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [feedback, setFeedback] = useState("");

  async function loadProducts() {
    const list = await getProducts();
    setProducts(list);
  }

  useEffect(() => {
    let isMounted = true;

    ensureProductsSeeded()
      .then(() => getProducts())
      .then((list) => {
        if (!isMounted) return;
        setProducts(list);
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function onNewInputChange(event) {
    const { name, value } = event.target;
    setNewForm((prev) => ({ ...prev, [name]: value }));
  }

  function onEditInputChange(event) {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCreate(event) {
    event.preventDefault();
    const payload = validateForm(newForm);

    if (!payload) {
      setFeedback("Preencha todos os campos com um preco valido.");
      return;
    }

    setCreating(true);
    setFeedback("");
    try {
      await createProduct(payload);
      setNewForm(EMPTY_FORM);
      await loadProducts();
      setFeedback("Produto criado com sucesso.");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      setFeedback("Nao foi possivel criar o produto.");
    } finally {
      setCreating(false);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setEditForm(toFormValues(product));
    setFeedback("");
  }

  function cancelEdit() {
    setEditingId("");
    setEditForm(EMPTY_FORM);
  }

  async function saveEdit(productId) {
    const payload = validateForm(editForm);
    if (!payload) {
      setFeedback("Preencha todos os campos com um preco valido.");
      return;
    }

    try {
      await updateProduct(productId, payload);
      await loadProducts();
      cancelEdit();
      setFeedback("Produto atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      setFeedback("Nao foi possivel atualizar o produto.");
    }
  }

  async function handleDelete(productId) {
    const confirmed = window.confirm("Deseja excluir este produto?");
    if (!confirmed) return;

    try {
      await deleteProduct(productId);
      await loadProducts();
      if (editingId === productId) cancelEdit();
      setFeedback("Produto excluido com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      setFeedback("Nao foi possivel excluir o produto.");
    }
  }

  return (
    <main className="products-crud-page">
      <header className="topbar">
        <h1>Gerenciar Produtos</h1>
        <div className="products-crud-links">
          <Link to="/admin">Ver pedidos</Link>
          <Link to="/">Ir para catálogo</Link>
        </div>
      </header>

      <section className="products-crud-section">
        <h2>Novo produto</h2>
        <form className="products-form" onSubmit={handleCreate}>
          <input
            type="text"
            name="name"
            placeholder="Nome"
            value={newForm.name}
            onChange={onNewInputChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Descricao"
            value={newForm.description}
            onChange={onNewInputChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Preco"
            min="0.01"
            step="0.01"
            value={newForm.price}
            onChange={onNewInputChange}
            required
          />
          <input
            type="text"
            name="image"
            placeholder="URL/caminho da imagem"
            value={newForm.image}
            onChange={onNewInputChange}
            required
          />
          <button type="submit" disabled={creating}>
            {creating ? "Salvando..." : "Criar produto"}
          </button>
        </form>
      </section>

      <section className="products-crud-section">
        <h2>Produtos cadastrados</h2>
        {feedback && <p className="products-feedback">{feedback}</p>}

        {loading ? (
          <p>Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p>Nenhum produto cadastrado.</p>
        ) : (
          <ul className="products-crud-list">
            {products.map((product) => {
              const isEditing = editingId === product.id;
              return (
                <li key={product.id} className="products-crud-item">
                  {isEditing ? (
                    <div className="products-edit-grid">
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={onEditInputChange}
                      />
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={onEditInputChange}
                      />
                      <input
                        type="number"
                        name="price"
                        min="0.01"
                        step="0.01"
                        value={editForm.price}
                        onChange={onEditInputChange}
                      />
                      <input
                        type="text"
                        name="image"
                        value={editForm.image}
                        onChange={onEditInputChange}
                      />
                    </div>
                  ) : (
                    <div className="products-summary">
                      <strong>{product.name}</strong>
                      <span>{product.description}</span>
                      <span>R$ {Number(product.price).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="products-actions">
                    {isEditing ? (
                      <>
                        <button type="button" onClick={() => saveEdit(product.id)}>
                          Salvar
                        </button>
                        <button type="button" className="btn-muted" onClick={cancelEdit}>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={() => startEdit(product)}>
                          Editar
                        </button>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={() => handleDelete(product.id)}
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
