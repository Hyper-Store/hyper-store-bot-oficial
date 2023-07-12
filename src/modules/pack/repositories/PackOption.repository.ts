import { Database } from "@/infra/app/setup-database"
import { randomUUID } from "crypto"
import { PackOptionModel } from "../models/PackOption.model";

export class PackOptionRepository {
    static async create(packId: string, packOption: PackOptionModel): Promise<PackOptionModel> {
        packOption.id = randomUUID();
        packOption.emoji = packOption.emoji ?? "📦"
        packOption.createdAt = new Date();

        const result = await new Database().set(`packs.${packId}.options.${packOption.id}`, packOption)

        return result as PackOptionModel;
    }

    static async findById(packId: string, packOptionId: string): Promise<PackOptionModel | null> {
        const result = await new Database().get(`packs.${packId}.options.${packOptionId}`)
        return result as PackOptionModel ?? null
    }

    static async getAll(packId: string): Promise<{ [key: string]: PackOptionModel } | null> {
        const result = await new Database().get(`packs.${packId}`)
        return result as { [key: string]: PackOptionModel } ?? null
    }
}