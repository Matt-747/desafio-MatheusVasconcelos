import { Request, Response } from "express";
import * as PlantRepository from "@repositories/PlantRepository";
import { Luminosidade } from "@prisma/client";

export const createPlant = async (req: Request, res: Response) => {
  try {
    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias } = req.body;

    let bool_nome = typeof nome === "string" && nome.trim() !== "";
    let bool_especie = typeof especie === "string" && especie.trim() !== "";

    let bool_preco = Number.isInteger(preco) && preco > 0;
    let bool_estoque = Number.isInteger(estoque) && estoque >= 0;
    let bool_rega = Number.isInteger(regaACadaDias) && regaACadaDias >= 1;

    let bool_luz = Object.values(Luminosidade).includes(luminosidade);

    let bool_pet = typeof petFriendly === "boolean";

    if (!bool_nome || !bool_especie || !bool_preco || !bool_estoque || !bool_luz || !bool_pet || !bool_rega) {
      return res.status(400).json({
        message: "Preencha com nome, espécie, preço, qtd. no estoque e infos adicionais (luminosidade, se é segura para animais de estimação e os nº de dias para se regar).",
      });
    }

    const planta = await PlantRepository.createPlant({
      nome: nome,
      especie: especie,
      preco: preco,
      estoque: estoque,
      luminosidade: luminosidade,
      petFriendly: petFriendly,
      regaACadaDias: regaACadaDias
    });

    return res.status(201).json(planta);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao armazenar dados da planta." });
  }
};

export const readAllPlants = async (req: Request, res: Response) => {
  try {
    const { luminosidade, petFriendly } = req.query;

    const isPetFriendly = petFriendly === undefined? undefined : petFriendly === "true";

    let isLuminosidade: Luminosidade | undefined = undefined;
    
    if(luminosidade !== undefined){
      const isvalidLum = Object.values(Luminosidade).includes(luminosidade as Luminosidade);

      if(!isvalidLum){
        return res.status(400).json({ message: "Valor de luminosidade inválido." });
      }

      isLuminosidade = luminosidade as Luminosidade;
    }

    const plants = await PlantRepository.findAllPlants({
      luminosidade: isLuminosidade, 
      petFriendly: isPetFriendly, 
    }
      );

    return res.status(200).json(plants);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar a planta desejada." });
  }
};


export const readPlantById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    let bool_id = Number.isInteger(id) && id > 0;
    if(!bool_id){
      return res.status(500).json({ message: "Problema na conversão de id para inteiro." });
    }

    const plant = await PlantRepository.findPlantById(id);

    if (!plant) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    return res.status(200).json(plant);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar planta." });
  }
};

export const updatePlant = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    let bool_id = Number.isInteger(id) && id > 0;
    if(!bool_id){
      return res.status(500).json({ message: "Problema na conversão de id para inteiro." });
    }

    const { nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias } = req.body;

    const dataToUpdate: any = {};

    if (nome !== undefined) {
      if (typeof nome !== "string" || nome.trim() === "") {
        return res.status(400).json({ message: "Nome inválido." });
      }
      dataToUpdate.nome = nome;
    }

    if (especie !== undefined) {
      if (typeof especie !== "string" || especie.trim() === "") {
        return res.status(400).json({ message: "Espécie inválida." });
      }
      dataToUpdate.especie = especie;
    }

    if (preco !== undefined) {
      if (!Number.isInteger(preco) || preco <= 0) {
        return res.status(400).json({ message: "Preço inválido." });
      }
      dataToUpdate.preco = preco;
    }

    if (estoque !== undefined) {
      if (!Number.isInteger(estoque) || estoque < 0) {
        return res.status(400).json({ message: "Estoque inválido." });
      }
      dataToUpdate.estoque = estoque;
    }

    if (regaACadaDias !== undefined) {
      if (!Number.isInteger(regaACadaDias) || regaACadaDias < 1) {
        return res.status(400).json({ message: "Número de dias para rega inválido." });
      }
      dataToUpdate.regaACadaDias = regaACadaDias;
    }

    if (luminosidade !== undefined) {
      if (!Object.values(Luminosidade).includes(luminosidade)) {
        return res.status(400).json({ message: "Luminosidade inválida." });
      }
      dataToUpdate.luminosidade = luminosidade;
    }

    if (petFriendly !== undefined) {
      if (typeof petFriendly !== "boolean") {
        return res.status(400).json({ message: "O campo petFriendly deve ser booleano." });
      }
      dataToUpdate.petFriendly = petFriendly;
    }

    const plant = await PlantRepository.findPlantById(id);

    if (!plant) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    const updatedPlant = await PlantRepository.updatePlant(id, dataToUpdate);

    return res.status(200).json(updatedPlant);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar dados da planta." });
  }
};

export const deletePlant = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    let bool_id = Number.isInteger(id) && id > 0;
    if(!bool_id){
      return res.status(500).json({ message: "Problema na conversão de id para inteiro." });
    }

    const plant = await PlantRepository.findPlantById(id);

    if (!plant) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    await PlantRepository.deletePlant(id);

    return res.status(204).send();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao deletar planta." });
  }
};

export const sellPlant = async (req: Request, res: Response) => {
  try{
    const id = Number(req.params.id);
    let bool_id = Number.isInteger(id) && id > 0;
    if(!bool_id){
      return res.status(500).json({ message: "Problema na conversão de id para inteiro." });
    }

    const plant = await PlantRepository.findPlantById(id);
    if(!plant){
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    const qtd_vendas = Number(req.body.quantidade);
    let bool_vendas = Number.isInteger(qtd_vendas) && qtd_vendas > 0;
    if(!bool_vendas){
      return res.status(500).json({ message: "Problema na conversão do nº de plantas vendidas." });
    }

    if(plant.estoque < qtd_vendas){
      return res.status(400).json({ message: "Quantidade no estoque insuficiente." });
    }
    
    const updatedPlant = await PlantRepository.sellPlant(id, qtd_vendas);
    return res.status(200).json(updatedPlant);

  } catch (error){
      console.error(error);
      return res.status(500).json({ message: "Erro ao efetuar venda." });
    }

}

export const totalPlant = async (req: Request, res: Response) => {
  try{
    const valorTotalVendas = await PlantRepository.totalSales();
    const estoqueTotal = await PlantRepository.totalStock();

    return res.status(200).json({
      valorTotalEmCentavos: valorTotalVendas,
      totalDeVasos: estoqueTotal
    });

  } catch(error){
    console.error(error);
    return res.status(500).json({ message: "Erro ao calcular o total do estoque." });
  }
}