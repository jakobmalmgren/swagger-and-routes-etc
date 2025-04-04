import express from "express";
import { read } from "fs";
const router = express.Router();
import fs from "fs/promises";

const app = express();
app.use(express.json());

// Endpoints för följande funktionalitet:

// Hämta alla produkter för att visa på en produktlistningssida
// Kunna lägga till en produkt i en varukorg
// Kunna ta bort en produkt i en varukorg
// Hämta alla produkter i en varukorg
// Kunna lägga en order med alla produkter från varukorgen
// ny fil för lägga ttill basket o fixa me de..
// gör nån typ av PUT med..

// swagger

// Lägg till CORS-stöd med hjälp av cors-biblioteket

// några middlewares

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
router.post("/basket", async (req, res) => {
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
