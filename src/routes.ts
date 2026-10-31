import express from "express";
import * as PlantController from "@controllers/PlantController";

const routes = express.Router();

routes.get("/", (req, res) => {
  res.status(200).json({ message: "API do treinamento de CRUD do CITi 🚀" });
});

// CRUD das Plantas
routes.post("/plantas", PlantController.createPlant); // Cria uma Planta
routes.get("/plantas", PlantController.readAllPlants); // Lê Todas as Plantas, com opção de filtro opcional
routes.get("/plantas/estoque/valor-total", PlantController.totalPlant); // Retorna o valor total do estoque e o nº total de vasos
routes.get("/plantas/:id", PlantController.readPlantById); // Procura a planta de acordo com seu ID
routes.patch("/plantas/:id", PlantController.updatePlant); // Atualiza os dados mencionados de uma planta específica
routes.delete("/plantas/:id", PlantController.deletePlant); // Deleta uma planta
routes.post("/plantas/:id/venda", PlantController.sellPlant); // Recebe uma qtd de plantas compradas e decrementa do estoque dela

export default routes;
