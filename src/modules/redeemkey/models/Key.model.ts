export type KeyModel = {
    id?: string,
    type: "role" | "message",
    content: string,
    recued?: boolean,
    rescuedBy?: string,
    rescuedAt?: Date
    createdAt: Date
}