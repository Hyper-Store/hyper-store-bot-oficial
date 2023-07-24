import { Database } from "@/infra/app/setup-database"
import { randomUUID } from "crypto"
import { PackModel } from "../models/Pack.model"

export class PackRepository {
    static async create(pack: PackModel): Promise<PackModel> {
        pack.id = randomUUID()
        pack.options = {}
        pack.createdAt = new Date()

        const result = await new Database().set(`packs.${pack.id}`, pack)

        return result as PackModel;
    }

    static async findById(packId: string): Promise<PackModel | null> {
        const result = await new Database().get(`packs.${packId}`)
        return result as PackModel ?? null
    }

    static async findByTitle(packTitle: string): Promise<PackModel | null> {
        const packAll = await this.getAll();

        for (const packId in packAll) {
            const pack = packAll[packId];

            if (pack.title === packTitle) return pack;
        }

        return null;
    }

    static async update(pack: PackModel): Promise<PackModel> {
        const result = new Database().set(`packs.${pack.id}`, pack)
        return result as PackModel
    }

    static async delete(packId: string): Promise<void> {
        new Database().delete(`packs.${packId}`)
    }

    static async getAll(): Promise<{ [key: string]: PackModel }> {
        const result = await new Database().get(`packs`)
        return result as { [key: string]: PackModel }
    }

    static async count(): Promise<number> {
        const result = await new Database().get('packs') as { [key: string]: PackModel }
        return result && Object.keys(result) ? Object.keys(result).length : 0;
    }
}