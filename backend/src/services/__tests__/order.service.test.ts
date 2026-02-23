import { createOrder, getOrderById } from "../order.service";
import { prisma } from "../../lib/prisma";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    $transaction: jest.fn(),
    order: {
      findUnique: jest.fn(),
    },
  },
}));

describe("Order Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createOrder", () => {
    const mockTx: any = {
      product: {
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      order: {
        create: jest.fn(),
      },
      orderItem: {
        createMany: jest.fn(),
      },
    };

    const mockData: any = {
      userId: "user-1",
      name: "João",
      email: "joao@email.com",
      street: "Rua A",
      number: "123",
      neighborhood: "Centro",
      city: "Caruaru",
      state: "PE",
      cep: "55000-000",
      complement: "",
      paymentMethod: "Pix",
      items: [{ productId: 1, quantity: 2 }],
    };

    it("deve lançar erro se produto não existir", async () => {
      mockTx.product.findUnique.mockResolvedValue(null);

      (prisma.$transaction as jest.Mock).mockImplementation((cb) =>
        cb(mockTx)
      );

      await expect(createOrder(mockData)).rejects.toThrow(
        "Produto 1 não encontrado"
      );
    });

    it("deve lançar erro se estoque for insuficiente", async () => {
      mockTx.product.findUnique.mockResolvedValue({
        id: 1,
        name: "Produto Teste",
        stock: 1,
        price: 10,
      });

      (prisma.$transaction as jest.Mock).mockImplementation((cb) =>
        cb(mockTx)
      );

      await expect(createOrder(mockData)).rejects.toThrow(
        "Estoque insuficiente para Produto Teste"
      );
    });

    it("deve criar pedido com sucesso", async () => {
      mockTx.product.findUnique.mockResolvedValue({
        id: 1,
        name: "Produto Teste",
        stock: 10,
        price: 10,
      });

      mockTx.product.update.mockResolvedValue({});
      mockTx.order.create.mockResolvedValue({ id: "order-1" });
      mockTx.orderItem.createMany.mockResolvedValue({});

      (prisma.$transaction as jest.Mock).mockImplementation((cb) =>
        cb(mockTx)
      );

      const result = await createOrder(mockData);

      expect(mockTx.product.update).toHaveBeenCalled();
      expect(mockTx.order.create).toHaveBeenCalled();
      expect(mockTx.orderItem.createMany).toHaveBeenCalled();
      expect(result).toEqual({ id: "order-1" });
    });
  });

  describe("getOrderById", () => {
    it("deve retornar pedido quando existir", async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue({
        id: "order-1",
        items: [],
      });

      const result = await getOrderById("order-1");

      expect(result).toHaveProperty("id", "order-1");
    });

    it("deve lançar erro quando pedido não existir", async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(getOrderById("order-1")).rejects.toThrow(
        "Pedido não encontrado"
      );
    });
  });
});