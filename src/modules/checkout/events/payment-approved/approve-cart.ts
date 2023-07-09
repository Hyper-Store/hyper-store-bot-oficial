import { Client } from "discord.js";

export class ApproveCartUsecase {
    static async execute(client: Client, checkoutId: string) {
        console.log("AEEEEEEEE aprovado!", checkoutId)
    }
}