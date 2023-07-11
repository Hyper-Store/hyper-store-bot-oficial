import { Database } from "@/infra/app/setup-database"
import { KeyModel } from "../models/Key.model"
import { generateKey } from "@/modules/@shared/utils/generate-key";

export class KeyRepository {
    static async create(key: KeyModel): Promise<KeyModel> {
        key.id = generateKey('XXXX-XXXX-XXXX');
        key.createdAt = new Date()

        const result = await new Database().set(`keys.${key.id}`, key)

        return result as KeyModel;
    }

    static async findById(keyId: string): Promise<KeyModel | null> {
        const result = new Database().get(`keys.${keyId}`)
        return result as KeyModel ?? null
    }

    static async update(key: KeyModel): Promise<KeyModel | null> {
        const result = new Database().set(`keys.${key.id}`, key)
        return result as KeyModel ?? null
    }
}