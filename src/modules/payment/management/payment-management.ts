class PaymentManagement {
    constructor(private readonly Props: PaymentManagement.Props) {

    }

    static create(input: PaymentManagement.Input): PaymentManagement {
        const paymentManagement = new PaymentManagement(input);
        return paymentManagement;
    }
}

export namespace PaymentManagement {
    export type PaymentProviders = "mercadopago" | "paypal"

    export type Props = {
        checkoutId: string,
        paymentProvider: PaymentProviders,
        paymentProviderId?: string
    }

    export type Input = {
        checkoutId: string,
        paymentProvider: PaymentProviders,
        paymentProviderId?: string
    }
}