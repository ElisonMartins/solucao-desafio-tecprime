import { Router } from "express";
import {
  addItem,
  getCart,
  updateItem,
  removeItem,
  clearCartItems
} from "./../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Operações relacionadas ao carrinho do usuário autenticado
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retorna o carrinho do usuário autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       productId:
 *                         type: integer
 *                       quantity:
 *                         type: integer
 *       401:
 *         description: Não autorizado
 */
router.get("/", authMiddleware, getCart);

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Adiciona um item ao carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Item adicionado ao carrinho
 *       400:
 *         description: Erro de validação
 */
router.post("/items", authMiddleware, addItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   patch:
 *     summary: Atualiza a quantidade de um item do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item do carrinho
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *       400:
 *         description: Erro de validação
 */
router.patch("/items/:itemId", authMiddleware, updateItem);

/**
 * @swagger
 * /cart/items/{itemId}:
 *   delete:
 *     summary: Remove um item do carrinho
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do item do carrinho
 *     responses:
 *       200:
 *         description: Item removido com sucesso
 *       400:
 *         description: Erro ao remover item
 */
router.delete("/items/:itemId", authMiddleware, removeItem);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Remove todos os itens do carrinho do usuário autenticado
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho limpo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Carrinho limpo com sucesso
 *       400:
 *         description: Erro ao limpar carrinho
 *       401:
 *         description: Não autorizado
 */
router.delete("/clear", authMiddleware, clearCartItems);

export default router;