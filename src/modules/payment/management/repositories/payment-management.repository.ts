import { Database } from "@/infra/app/setup-database"
import { PaymentManagementEntity } from "../entities"


export class PaymentManagementRepository {

    static async create(paymentManagementEntity: PaymentManagementEntity): Promise<void> {
        const database = new Database()
        database.set(
            `payment.paymentManagement.${paymentManagementEntity.checkoutId}`,
            paymentManagementEntity.toJSON()
        )
    }


    static async findById(checkoutId: string): Promise<PaymentManagementEntity | null> {

        const database = new Database()
        const paymentManagement: PaymentManagementEntity.Props = database.get(
            `payment.paymentManagement.${checkoutId}`
        )
        if (!paymentManagement) return null

        return PaymentManagementEntity.create({
            checkoutId: paymentManagement.checkoutId,
        })
    }
}