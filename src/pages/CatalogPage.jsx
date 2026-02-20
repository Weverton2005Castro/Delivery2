import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CartPanel from "../components/CartPanel";
import CheckoutModal from "../components/CheckoutModal";
import { getProducts } from "../services/productsService";
import { createOrder } from "../services/ordersService";
import "./catalog.css";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const feedbackTimerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    getProducts().then((data) => {
      if (!isMounted) return;
      setProducts(data);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const total = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0
      ),
    [cartItems]
  );

  const updateCart = useCallback((productId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const openCheckout = useCallback(() => {
    setIsCheckoutOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false);
  }, []);

  const handleIncrement = useCallback(
    (id) => {
      updateCart(id, 1);
    },
    [updateCart]
  );

  const handleDecrement = useCallback(
    (id) => {
      updateCart(id, -1);
    },
    [updateCart]
  );

  const handleSubmitOrder = useCallback(async (orderData) => {
    await createOrder(orderData);
    setCartItems([]);
    setIsCheckoutOpen(false);

    setFeedback("Pedido enviado com sucesso.");
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(""), 2400);
  }, []);

  return (
    <main className="catalog-page">
      <header className="topbar">
        <h1>Produtos</h1>
        {/* <Link to="/admin">Ir para admin</Link> */}
      </header>

      {feedback && <div className="success-banner">{feedback}</div>}

      <section className="content">
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} />
          ))}
        </div>

        <CartPanel
          items={cartItems}
          total={total}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={removeItem}
          onOpenCheckout={openCheckout}
        />
      </section>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cartItems}
        total={total}
        onClose={closeCheckout}
        onSubmit={handleSubmitOrder}
      />
    </main>
  );
}
