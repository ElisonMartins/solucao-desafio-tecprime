import { fetchFakeStoreProducts } from "../integrations/fakestore.integration";

type FakeStoreProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
};

export const getNormalizedProducts = async () => {
  const products = await fetchFakeStoreProducts();
  //Normalização dos dados
  return products.map((p: FakeStoreProduct) => ({
    id: p.id,
    nome: p.title,
    descricao: p.description,
    preco: Number(p.price) * 5,// conversão fictícia para Reais
    estoque: Math.floor(Math.random() * 20) + 1,
    imagem: p.image
  }));
};
