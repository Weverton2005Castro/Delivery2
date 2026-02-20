import {
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
  update,
} from "firebase/database";
import { rtdb } from "../firebase";

const ordersRef = ref(rtdb, "orders");

export async function createOrder(orderInput) {
  const newOrderRef = push(ordersRef);

  const payload = {
    customerName: orderInput.customerName,
    phone: orderInput.phone,
    deliveryType: orderInput.deliveryType,
    address: orderInput.address || "",
    complement: orderInput.complement || "",
    products: orderInput.products,
    total: Number(orderInput.total || 0),
    status: "pendente",
    createdAt: serverTimestamp(),
  };

  await set(newOrderRef, payload);
  return newOrderRef.key;
}

export function subscribeOrders(callback) {
  return onValue(ordersRef, (snapshot) => {
    const raw = snapshot.val() || {};
    const list = Object.entries(raw).map(([id, value]) => ({
      id,
      ...value,
    }));

    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  });
}

export async function updateOrderStatus(orderId, status) {
  const orderRef = ref(rtdb, `orders/${orderId}`);
  await update(orderRef, { status });
}
