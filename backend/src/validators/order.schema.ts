import { z } from "zod";

export const createOrderSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),

  street: z.string().min(3),
  number: z.string().min(1),
  neighborhood: z.string().min(2),
  city: z.string().min(2),
  state: z.string().min(2),
  cep: z.string().min(5),
  complement: z.string().optional(),

  paymentMethod: z.enum(["Pix", "Cartão", "Boleto"]),

  userId: z.string().uuid(),

  items: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1),
    })
  ).min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;