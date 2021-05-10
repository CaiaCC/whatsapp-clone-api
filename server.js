import express from "express";
import mongoose from "mongoose";

const app = express();
const port = process.env.PORT || 9000;

const connectionURL =
    "mongodb+srv://admin:BOQd4Im50aCbRufc@cluster0.7epvq.mongodb.net/whatsappDb?retryWrites=true&w=majority";
mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get("/", (req, res) => res.status(200).send("YO WHAT UP"));

app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
});
