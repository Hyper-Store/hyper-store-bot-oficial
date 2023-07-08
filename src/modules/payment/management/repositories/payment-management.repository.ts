import { Database } from "@/infra/app/setup-database"
import { PaymentManagementEntity } from "../entities"


export class PaymentManagementRepository {


    static async create(paymentManagementEntity: PaymentManagementEntity): Promise<void> {
        const database = new Database()
        database.set(
            `purchases.payment.paymentManagement.${paymentManagementEntity.checkoutId}`, 
        paymentManagementEntity.toJSON()
        )
    }
}