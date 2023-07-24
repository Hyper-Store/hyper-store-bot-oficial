export type CreateKeyModel = {
    service: "Rockstar" | "Valorant",
    daysToExpire: number,
    quantityPerDay: number,
    quantity: number
}

export const CreateKeyModelMap: Record<CreateKeyModel["service"], string> = {
    Rockstar: "Rockstar",
    Valorant: "Valorant",
};