import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routes/products.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

//swagger
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      description: "API för testItems",
      title: "API-test",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

//kallar på de olika routsen:

app.use("/api/products", productsRouter);

app.listen(PORT, () => {
  console.log(`servern är igång på http://localhost:${PORT}`);
});
