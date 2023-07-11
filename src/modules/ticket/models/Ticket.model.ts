import { TicketTypeModel } from "./TicketType.model"

export type TicketModel = {
    id: string,
    ownerId: string,
    sessionId: string
    reason: string,
    type: TicketTypeModel["id"]
    messageId: string
    createdAt: Date
}