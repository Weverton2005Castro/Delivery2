import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import { subscribeOrders, updateOrderStatus } from "../services/ordersService";
import "./admin.css";

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("55")) return digits;
  return `55${digits}`;
}

function buildStatusMessage(order, status) {
  const customer = order.customerName || "Cliente";
  const total = Number(order.total || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return [
    `Ola, ${customer}!`,
    `Seu pedido foi atualizado para: *${status}*`,
    `Total do pedido: ${total}`,
    "Obrigado por pedir com a gente.",
  ].join("\n");
}

function openWhatsAppForStatus(order, status) {
  const phone = normalizePhone(order.phone);
  if (!phone) return;

  const message = encodeURIComponent(buildStatusMessage(order, status));
  const url = `https://wa.me/${phone}?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeOrders((list) => {
      setOrders(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleChangeStatus(order, status) {
    await updateOrderStatus(order.id, status);
    openWhatsAppForStatus(order, status);
  }

  return (
    <main className="admin-page">
      <header className="topbar">
        <h1>Admin de Pedidos</h1>
        <Link to="/">Voltar ao catálogo</Link>
      </header>

      {loading ? (
        <p>Carregando pedidos...</p>
      ) : orders.length === 0 ? (
        <p>Nenhum pedido recebido ainda.</p>
      ) : (
        <section className="orders-grid">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onChangeStatus={handleChangeStatus} />
          ))}
        </section>
      )}
    </main>
  );
}


