
export class PaymentManagementEntity {
    constructor(private readonly props: PaymentManagementEntity.Props) {

    }

    hasPaymentProvider(): boolean {
        return !!this.props.paymentProvider && !!this.props.paymentProviderId;
    }

    static create(input: PaymentManagementEntity.Input): PaymentManagementEntity {
        const paymentManagement = new PaymentManagementEntity({
            ...input,
            dateTimeCreated: input.dateTimeCreated || new Date() 
        });
        return paymentManagement;
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

    export type Props = {
        checkoutId: string,
        paymentProvider?: PaymentProviders,
        paymentProviderId?: string
        dateTimeCreated: Date
    }

    export type Input = {
        checkoutId: string,
        paymentProvider?: PaymentProviders,
        paymentProviderId?: string
        dateTimeCreated?: Date
    }

    export type JSON = Props
}