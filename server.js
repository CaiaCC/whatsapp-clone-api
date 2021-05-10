import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";

const app = express();
const port = process.env.PORT || 9000;

app.use(express.json());

const connectionURL =
    "mongodb+srv://admin:BOQd4Im50aCbRufc@cluster0.7epvq.mongodb.net/whatsappDb?retryWrites=true&w=majority";

mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get("/", (req, res) => res.status(200).send("server is running!"));

app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
});

app.post("/messages/new", (req, res) => {
    const dbMessage = req.body;

    Messages.create(dbMessage, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    });
});

app.listen(port, () => {
    console.log(`server is listening on port: ${port}`);
});
