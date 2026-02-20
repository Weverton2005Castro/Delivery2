const MOCK_PRODUCTS = [
  {
    id: "p1",
    name: "Filé com fritas",
    description: "Filé grelhado acompanhado de fritas crocantes.",
    price: 29.9,
    image: "/placeholders/p1-file-com-fritas.svg",
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

export async function getProducts() {
  return MOCK_PRODUCTS;
}
