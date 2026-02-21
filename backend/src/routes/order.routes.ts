import { Router } from "express";
import {
  createOrderController,
  getOrderByIdController,
} from "../controllers/order.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de pedidos
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Criar um novo pedido
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - street
 *               - number
 *               - city
 *               - state
 *               - cep
 *               - paymentMethod
 *               - items
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               street:
 *                 type: string
 *               number:
 *                 type: string
 *               neighborhood:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               cep:
 *                 type: string
 *               complement:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *                 enum: [Pix, Cartão, Boleto]
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.post("/", createOrderController);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get("/:id", getOrderByIdController);

export default router;