import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import cors from "cors";

import productRoutes from "./routes/product.routes";

import authRoutes from "./routes/auth.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("API Tecprime rodando");
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
