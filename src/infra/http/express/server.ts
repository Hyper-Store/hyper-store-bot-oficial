import { CreateMercadopagoPaymentUsecase } from "@/modules/payment/providers/mercadopago/usecases/application-actions"
import express from "express"
import "dotenv/config"

const app = express()
app.use(express.json())

app.post("/payment/mercadopago/callback", async (req, res) => {

    await new CreateMercadopagoPaymentUsecase().execute({
        mercadopagoPaymentId: req.body.data.id ?? ""
    })

    res.status(200).json({ ok: true })
})


const PORT = 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
