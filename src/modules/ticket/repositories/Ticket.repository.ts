import { Database } from "@/infra/app/setup-database"
import { randomUUID } from "crypto"
import { TicketModel } from "../models/Ticket.model"

export class TicketRepository {
    static async create(ticket: TicketModel): Promise<TicketModel> {
        ticket.sessionId = randomUUID()
        ticket.createdAt = new Date()

        const result = await new Database().set(`tickets.${ticket.id}`, ticket)

        return result as TicketModel;
    }

    static async findById(ticketId: string): Promise<TicketModel | null> {
        const result = new Database().get(`tickets.${ticketId}`)
        return result as TicketModel ?? null
    }

    static async update(ticket: TicketModel): Promise<void> {
        new Database().set(`tickets.${ticket.id}`, ticket)
    }
}