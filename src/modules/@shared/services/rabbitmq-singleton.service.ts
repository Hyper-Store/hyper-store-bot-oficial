import { RabbitmqServerProvider } from "../providers"


export class RabbitmqSingletonService {

    static rabbitmqServerProvider: RabbitmqServerProvider


    static async getInstance(): Promise<RabbitmqServerProvider> {
        if(!RabbitmqSingletonService.rabbitmqServerProvider) {
            RabbitmqSingletonService.rabbitmqServerProvider = new RabbitmqServerProvider(process.env.RABBITMQ_LOGIN_CREDENTIALS!)
            await RabbitmqSingletonService.rabbitmqServerProvider.start()
        }
        return RabbitmqSingletonService.rabbitmqServerProvider
    }
}