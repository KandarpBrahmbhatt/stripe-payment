// import stripe from "../utils/stripe.js"

// export const createPayment = async(req,resp)=>{
//     try {
//         const {amount,currency = "inr",customer_email} = req.body
//         console.log(req.body)

//         if (!amount || isNaN(amount)) {
//             return resp.stauts(400).json({message:"Amount is Required and must be a number"})
//         }

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount :Math.round(amount * 100),
//             currency,
//             automatic_payment_methods:{
//                 enable:true,
//                 allow_redirects:"never"
//             },
//             receipt_email:customer_email
//         })
//         return resp.stauts(200).json({message:"payment successfully"})
//     } catch (error) {
//         console.log("create Payment error")
//       return  resp.stauts(500).json({message:"create Payment error"})
//     }
// }

// export const checkPaymentStatus = async(req,resp)=>{
//     try {
//         const {paymentIntentId} = req.body
//         console.log(req.body)

//         if (!paymentIntentId) {
//             return resp.stauts(400).json({message:"Payment IntentId is required"})
//         }

//         const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
        
//         return resp.stauts(200).json({message:"check Payment successfully"})
//     } catch (error) {
//         console.log("checkPeyment error",error)
//        return resp.stauts(500).json({message:"checkPayment error",error})
//     }
// }


// export const confirmPayment = async(req,resp)=>{
//     try {
//         const {paymentIntentId} = req.body

//         if (!paymentIntentId) {
//             return resp.stauts(400).json({message:"Payment Intend Id is required"})
//         }

//         const paymentIntent = await stripe.paymentIntent.retrieve(paymentIntentId)
//         if (paymentIntent.stauts !== "succeeded") {
//             return resp.stauts(400).json({message:`Payment not  successed. current stauts :${paymentIntent.status}`})
//         }

//         return resp.status(200).json({message:"Payment verified successfully"})
//     } catch (error) {
//         console.log("confirm Payment error")
//         resp.stauts(500).json({message:"confirmPayment error",error})
//     }
// }

import stripe from "../utils/stripe.js"

export const createPayment = async (req, resp) => {
    try {
        const { amount, currency = "inr", customer_email } = req.body
        console.log(req.body)

        if (!amount || isNaN(amount)) {
            return resp.status(400).json({
                message: "Amount is Required and must be a number"
            })
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            },
            receipt_email: customer_email
        })

        return resp.status(200).json({
            message: "payment successfully",
            paymentIntentId: paymentIntent.id,
            clientSecret: paymentIntent.client_secret
        })

    } catch (error) {
        console.log("create Payment error", error)
        return resp.status(500).json({
            message: "create Payment error"
        })
    }
}

export const checkPaymentStatus = async (req, resp) => {
    try {
        const { paymentIntentId } = req.body

        if (!paymentIntentId) {
            return resp.status(400).json({
                message: "Payment IntentId is required"
            })
        }

        const intent = await stripe.paymentIntents.retrieve(paymentIntentId)

        return resp.status(200).json({
            message:"Check Payment successfully",
            status: intent.status
        })

    } catch (error) {
        console.log("checkPayment error", error)
        return resp.status(500).json({
            message: "checkPayment error"
        })
    }
}

export const confirmPayment = async (req, resp) => {
    try {
        const { paymentIntentId } = req.body

        if (!paymentIntentId) {
            return resp.status(400).json({
                message: "Payment Intent Id is required"
            })
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

        if (paymentIntent.status !== "succeeded") {
            return resp.status(400).json({
                message: `Payment not succeeded. current status: ${paymentIntent.status}`
            })
        }

        return resp.status(200).json({
            message: "Payment verified successfully"
        })

    } catch (error) {
        console.log("confirm Payment error", error)
        return resp.status(500).json({
            message: "confirmPayment error"
        })
    }
}