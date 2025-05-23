import express from "express";
const router = express.Router();
import fs from "fs/promises";

const app = express();
app.use(express.json());

import productSchema from "../validators/productSchema.js";

// Endpoints för följande funktionalitet:

// Hämta alla produkter för att visa på en produktlistningssida
// Kunna lägga till en produkt i en varukorg
// Kunna ta bort en produkt i en varukorg
// Hämta alla produkter i en varukorg
// Kunna lägga en order med alla produkter från varukorgen
// ny fil för lägga ttill basket o fixa me de..
// gör nån typ av PUT med..

//sen:
// swagger
// sen:
// Lägg till CORS-stöd med hjälp av cors-biblioteket
// sen:
// några middlewares

// swagger

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags:
 *       - products
 *     summary: Hämta alla produkter
 *     description: Returnerar en lista med alla produkter
 *     responses:
 *       200:
 *         description: Lyckad hämtning av produkter
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *                   shortDesc:
 *                     type: string
 *                   category:
 *                     type: string
 *                   longDesc:
 *                     type: string
 *                   imgFile:
 *                     type: string
 *                   serial:
 *                     type: string
 */
/**
 * @swagger
 *  /api/products/add:
 *   post:
 *     tags:
 *       - products
 *     summary: lägger till produkter
 *     description: lägger till produkter
 *     responses:
 *       200:
 *         description: Lyckad add av produkter
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   price:
 *                     type: number
 *                   shortDesc:
 *                     type: string
 *                   category:
 *                     type: string
 *                   longDesc:
 *                     type: string
 *                   imgFile:
 *                     type: string
 *                   serial:
 *                     type: string
 */

//funktion som läser filer
const readFile = async (content) => {
  try {
    const readContent = await fs.readFile(content, "utf8");

    return readContent;
  } catch (err) {
    console.log(err);
  }
};
//funktion som skriver filer
const writeFile = async (where, what) => {
  try {
    const writeContent = await fs.writeFile(where, JSON.stringify(what));

    return writeContent;
  } catch (err) {
    console.log(err);
  }
};

// Hämta alla produkter för att visa på en produktlistningssida
router.get("/", async (req, res) => {
  try {
    const fileData = await readFile("products.json");
    const parsedData = JSON.parse(fileData);
    res.status(200).json({ message: "it went well", data: parsedData });
  } catch (err) {
    res.status(400).json({ message: `error reading file:` + err.message });
  }
});

// Kunna lägga till en produkt i en varukorg
router.post("/basket", async (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    return next(error); // skickar error ttill middleware
    //dvs min errorhandler
    // /När ett fel skickas med next(error)
    // i Express, letar Express specifikt efter
    //  middleware som har den här signaturen
    //   (med fyra argument).
    // express känner igen att de ja skickar inom next(här) är ettt
    // fel så skickas de som argumentett då : next(error) o tas emot av err
    // i errorhandlern och err..och hur de vet de är en errorhandler:
    // jo den har 4 st parametrar o första är::: err
  }
  try {
    const addedProduct = req.body;
    const readData = await readFile("basket.json");
    const parsedData = JSON.parse(readData);
    parsedData.push(addedProduct);
    await writeFile("basket.json", parsedData);

    res.status(200).json({
      message: `the item was added succesfully`,
      addedItem: addedProduct,
      updatedItems: parsedData,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Kunna ta bort en produkt i en varukorg

router.delete("/basket/:prodName", async (req, res) => {
  try {
    const productName = req.params.prodName;

    const readData = await readFile("basket.json");
    const parsedData = JSON.parse(readData);

    const newArray = parsedData.filter((item) => {
      return item.title !== productName;
    });

    await fs.writeFile("basket.json", JSON.stringify(newArray));
    res.status(200).json({
      message: `ìtem:${productName} succesfully removed`,
      newData: newArray,
    });
  } catch (err) {
    res.status(500).json({ message: `item wasnt able to delete` });
  }
});

// Hämta alla produkter i en varukorg
router.get("/basket", async (req, res) => {
  try {
    const data = await readFile("basket.json");
    const parsedData = JSON.parse(data);
    res.status(200).json({
      message: "din basket har hämtats utan problem",
      data: parsedData,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "datan hämtades inte", error: err.message });
  }
});

// Kunna lägga en order med alla produkter från varukorgen

router.post("/basket/order", async (req, res) => {
  try {
    const readData = await readFile("basket.json");
    const parsedData = JSON.parse(readData);
    res.status(200).json({ message: "ordern lagd", order: parsedData });
  } catch (err) {
    res
      .status(500)
      .json({ message: "ordern gick inte igenom", error: err.message });
  }
});

// ändra enskild property med PUT
router.put("/basket/:prodName", async (req, res) => {
  const prodName = req.params.prodName;
  const updatedInfo = req.body;
  try {
    const readData = await readFile("basket.json");
    const parsedData = JSON.parse(readData);
    const prodIndex = parsedData.findIndex((item) => {
      return item.title === prodName;
    });
    if (prodIndex === -1) {
      return res
        .status(404)
        .json({ message: "itemet du ville uppdatera finns inte" });
    }
    parsedData[prodIndex] = { ...parsedData[prodIndex], ...updatedInfo };
    await writeFile("basket.json", parsedData);
    res.status(200).json({
      message: `itemnamnet: ${prodName} uppdaterades`,
      updatedData: parsedData[prodIndex],
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "server fel kunde inte uppdatera", error: err.message });
  }
});
export default router;
