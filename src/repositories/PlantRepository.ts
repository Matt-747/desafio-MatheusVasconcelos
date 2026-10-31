import { Luminosidade, Prisma } from "@prisma/client";
import prisma from "@database";

export const createPlant = async (data: Prisma.PlantCreateInput) => {
    return await prisma.plant.create({
        data: data,
    });
};

export const findAllPlants = async (filters: { luminosidade?: Luminosidade; petFriendly?: boolean }) => {
    return await prisma.plant.findMany({
        where: {
            luminosidade: filters.luminosidade,
            petFriendly: filters.petFriendly,
        },
        orderBy: { id : 'asc'}
    });
};

export const findPlantById = async (id: number) => {
    return await prisma.plant.findUnique({
        where: { id: id }
    });
};

export const updatePlant = async (id: number, data: Prisma.PlantUpdateInput) => {
    return await prisma.plant.update({
        where: { id: id },
        data: data,
    });
};

export const deletePlant = async (id: number) => {
    return await prisma.plant.delete({
        where: { id: id }
    });
};

export const sellPlant = async (id: number, qtd_venda: number) => {
    return await prisma.plant.update({
    where: { id: id },
    data: {
        estoque: {
            decrement: qtd_venda ,
            }
        }
    })
}

export const totalSales = async () => {
    const plants = await prisma.plant.findMany();

    return plants.reduce((acc, plant) => {return acc + (plant.preco * plant.estoque)}, 0); // Multiplica 
}

export const totalStock = async() => {
    const total_vases = await prisma.plant.aggregate({
        _sum: {
            estoque: true,
        },
    });

    return total_vases._sum.estoque ?? 0;
}