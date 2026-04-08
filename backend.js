// import express from 'express'

// import dotenv from "dotenv"
// import paymentRouter from './routes/payment.routes.js'
// import cors from "cors"
// import connectDB from './config/db.js'
// dotenv.config()
// const app = express()

// app.use("/api/payment",paymentRouter)
// app.use(express.json())

// app.use(express.static("public"))

// const port = process.env.PORT || 8080
// app.listen(port,()=>{
//     console.log(`Server is Started ${port}`)
//     connectDB()
// })


// // implement stripe payment  open test stripe account and study about it. so API to generate stripe subscription link ..
// // and than webhook to read stripe status of payment and update in database
import express from 'express'
import dotenv from "dotenv"
import paymentRouter from './routes/payment.routes.js'
import cors from "cors"
import connectDB from './config/db.js'

dotenv.config()
const app = express()

// webhook must use raw BEFORE json
app.use("/api/payment/webhook", express.raw({ type: "application/json" }))

// other routes use json
app.use(express.json())

app.use("/api/payment", paymentRouter)

app.use(express.static("public"))

const port = process.env.PORT || 8080
app.listen(port,()=>{
    console.log(`Server is Started ${port}`)
    connectDB()
})