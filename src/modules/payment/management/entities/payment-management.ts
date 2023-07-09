
export class PaymentManagementEntity {
    constructor(private readonly props: PaymentManagementEntity.Props) {

    }

    hasPaymentProvider(): boolean {
        console.log(this.props.paymentProvider, this.props.paymentProviderId)
        return !!this.props.paymentProvider && !!this.props.paymentProviderId;
    }

    static create(input: PaymentManagementEntity.Input): PaymentManagementEntity {
        const paymentManagement = new PaymentManagementEntity({
            ...input,
            dateTimeCreated: input.dateTimeCreated || new Date(),
            status: "PENDING"
        });
        return paymentManagement;
    }

    setMercadopagoProvider(paymentProviderId: string): void {
        this.props.paymentProvider = "mercadopago"
        this.props.paymentProviderId = paymentProviderId
    }

    refund(): void {
        this.props.status = "REFUNDED"
    }

    cancel(): void {
        this.props.status = "CANCELLED"
    }

    approve(): void {
        this.props.status = "APPROVED"
    }

    get paymentProviderId(): string | undefined {
        return this.props.paymentProviderId
    }

    toJSON(): PaymentManagementEntity.JSON {
        return {
            ...this.props
        }
    }

    get checkoutId(): string {
        return this.props.checkoutId
    }
}

export namespace PaymentManagementEntity {
    export type PaymentProviders = "mercadopago" | "paypal"
    export type Status = "PENDING" | "REFUNDED" | "APPROVED" | "CANCELLED"

    export type Props = {
        checkoutId: string,
        paymentProvider?: PaymentProviders,
        paymentProviderId?: string
        dateTimeCreated: Date
        status?: Status
    }

    export type Input = {
        checkoutId: string,
        paymentProvider?: PaymentProviders,
        paymentProviderId?: string
        dateTimeCreated?: Date
    }

    export type JSON = Props
}