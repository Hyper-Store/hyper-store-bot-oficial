import { Database } from "@/infra/app/setup-database"
import { randomUUID } from "crypto"
import { CheckoutModel } from "../models/Checkout.model"

export class CheckoutRepository {
    static async create(checkout: CheckoutModel): Promise<CheckoutModel> {
        checkout.ref = randomUUID()
        checkout.status = "PENDING"
        checkout.quantity = 1
        checkout.price = 0;
        checkout.createdAt = new Date()

        const result = await new Database().set(`checkouts.${checkout.id}`, checkout)

        return result as CheckoutModel;
    }

    static async findById(checkoutId: string): Promise<CheckoutModel | null> {
        const result = new Database().get(`checkouts.${checkoutId}`)
        return result as CheckoutModel ?? null
    }

    static async update(checkout: CheckoutModel): Promise<void> {
        new Database().set(`checkouts.${checkout.id}`, checkout)
    }
}