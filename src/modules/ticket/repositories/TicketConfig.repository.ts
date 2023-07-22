import { TicketConfigModel } from "../models/TicketConfig.model"
import { DatabaseConfig } from "@/infra/app/setup-config"

export class TicketConfigRepository {
    static async getOption(option: keyof TicketConfigModel): Promise<any | null> {
        const result = new DatabaseConfig().get(`tickets.${option}`)
        return result ?? null
    }

    static async getAllOption(): Promise<TicketConfigModel | null> {
        const result = new DatabaseConfig().get(`tickets`)
        return result as TicketConfigModel ?? null
    }
}