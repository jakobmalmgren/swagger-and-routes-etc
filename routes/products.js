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

// Lägg till CORS-stöd med hjälp av cors-biblioteket

// swagger

//funktion som läser filer
const readFile = async (content) => {
  try {
    const readContent = await fs.readFile(content, "utf8");

    return readContent;
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
router.post("/", async (req, res) => {
  try {
    const readData = await readFile("products.json");
    const parsedData = JSON.parse(readData);
    const addedProduct = req.body;
    // console.log(addedProduct);
    parsedData.push(addedProduct);

    await fs.writeFile("products.json", JSON.stringify(parsedData));
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

router.delete("/:prodName", async (req, res) => {
  try {
    const productName = req.params.prodName;

    const readData = await readFile("products.json");
    const parsedData = JSON.parse(readData);

    const newArray = parsedData.filter((item) => {
      return item.title !== productName;
    });

    await fs.writeFile("products.json", JSON.stringify(newArray));
    res.status(200).json({
      message: `ìtem:${productName} succesfully removed`,
      newData: newArray,
    });
  } catch (err) {
    res.status(500).json({ message: `item wasnt able to delete` });
  }
});

export default router;
