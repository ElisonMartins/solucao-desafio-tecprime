import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", productRoutes);

app.get("/", (req, res) => {
  res.send("API Tecprime rodando 🚀");
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
