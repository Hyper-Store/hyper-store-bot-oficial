import { Database } from "@/infra/app/setup-database"
import { TicketTypeModel } from "../models/TicketType.model"
import { emojis } from "@/modules/@shared/utils/emojis"

export const TypeTicket: TicketTypeModel[] = [
    {
        id: "buy",
        emoji_custom: emojis.money,
        emoji: "💸",
        title: "Compra",
        description: "Realize uma compra de um produto"
    },
    {
        id: "budget",
        emoji_custom: "📦",
        emoji: "📦",
        title: "Orçamento",
        description: "Realize um orçamento de um site ou bot personalizado"
    },
    {
        id: "doubt",
        emoji_custom: "💡",
        emoji: "💡",
        title: "Dúvida",
        description: "Tirar dúvida sobre um produto"
    }
]

export class TicketRepository {
    static async findById(ticketTypeId: string): Promise<TicketTypeModel | null> {
        const result = TypeTicket.find(t => t.id === ticketTypeId);
        return result ?? null
    }

    static async getAll(): Promise<TicketTypeModel[] | null> {
        const result = TypeTicket
        return result
    }
}