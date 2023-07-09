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

    static async update(paymentManagementEntity: PaymentManagementEntity): Promise<void> {
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
        ) as PaymentManagementEntity.Props
        if (!paymentManagement) return null
        console.log(paymentManagement)
        const paymentManagementEntity = PaymentManagementEntity.create({
            ...paymentManagement
        })
        if (paymentManagement.status === "APPROVED") paymentManagementEntity.approve()
        if (paymentManagement.status === "CANCELLED") paymentManagementEntity.cancel()
        if (paymentManagement.status === "REFUNDED") paymentManagementEntity.refund()

        return paymentManagementEntity
    }
}