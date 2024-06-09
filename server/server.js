const express = require("express");
const cors = require("cors"); 
const bodyParser = require("body-parser"); 

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json()); 
app.use(cors({ origin: true, credentials: true })); 

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/checkout", async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: req.body.items.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        images: [item.product]
                    },
                    unit_amount: item.price * 100
                },
                quantity: 1
            })),
            mode: "payment",
            success_url: "https://localhost:4242/success", 
            cancel_url: "https://localhost:4242/cancel" 
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        next(error);
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
