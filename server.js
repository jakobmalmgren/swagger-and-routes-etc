import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";

dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

//kallar på de olika routsen:

app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`servern är igång på http://localhost:${PORT}`);
});
