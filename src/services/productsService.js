import { get, push, ref, remove, set, update } from "firebase/database";
import { rtdb } from "../firebase";

const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Filé com fritas",
    description: "Filé grelhado acompanhado de fritas crocantes.",
    price: 29.9,
    image: "/placeholders/detox.png",
  },
  {
    id: "p2",
    name: "Strogonoff",
    description: "Strogonoff cremoso com arroz e batata palha.",
    price: 27.5,
    image: "/placeholders/p2-strogonoff.svg",
  },
  {
    id: "p3",
    name: "Feijoada",
    description: "Feijoada tradicional completa.",
    price: 32,
    image: "/placeholders/p3-feijoada.svg",
  },
  {
    id: "p4",
    name: "Coca-Cola lata",
    description: "Refrigerante 350ml.",
    price: 6,
    image: "/placeholders/p4-coca-cola.svg",
  },
  {
    id: "p5",
    name: "Guaraná lata",
    description: "Refrigerante 350ml.",
    price: 5.5,
    image: "/placeholders/p5-guarana.svg",
  },
  {
    id: "p6",
    name: "Pudim",
    description: "Pudim de leite condensado.",
    price: 12,
    image: "/placeholders/p6-pudim.svg",
  },
];

const productsRef = ref(rtdb, "products");

function toPayload(productInput) {
  return {
    name: String(productInput.name || "").trim(),
    description: String(productInput.description || "").trim(),
    price: Number(productInput.price || 0),
    image: String(productInput.image || "").trim(),
  };
}

function normalizeProducts(raw) {
  return Object.entries(raw || {}).map(([id, value]) => ({
    id,
    name: value?.name || "",
    description: value?.description || "",
    price: Number(value?.price || 0),
    image: value?.image || "",
  }));
}

export async function getProducts() {
  const snapshot = await get(productsRef);
  const databaseProducts = normalizeProducts(snapshot.val());

  if (databaseProducts.length > 0) {
    return databaseProducts;
  }

  return MOCK_PRODUCTS;
}

export async function createProduct(productInput) {
  const newProductRef = push(productsRef);
  await set(newProductRef, toPayload(productInput));
  return newProductRef.key;
}

export async function updateProduct(productId, productInput) {
  const productRef = ref(rtdb, `products/${productId}`);
  await update(productRef, toPayload(productInput));
}

export async function deleteProduct(productId) {
  const productRef = ref(rtdb, `products/${productId}`);
  await remove(productRef);
}

export async function ensureProductsSeeded() {
  const snapshot = await get(productsRef);
  if (snapshot.exists()) return;

  const seedMap = MOCK_PRODUCTS.reduce((acc, product) => {
    acc[product.id] = toPayload(product);
    return acc;
  }, {});

  await set(productsRef, seedMap);
}
