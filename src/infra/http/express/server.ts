import { CreateMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/application-actions"
import express from "express"

const app = express()

app.post("payment/mercadopago", async (req, res) => {

    await new CreateMercadopagoPaymentUsecase().execute({
        mercadopagoPaymentId: req.body.id
    })

    res.status(200).json({ ok: true })
})

const PORT = 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
