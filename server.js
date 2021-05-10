import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import Messages from "./dbMessages.js";

const app = express();
const port = process.env.PORT || 9000;
const connectionURL =
    "mongodb+srv://admin:BOQd4Im50aCbRufc@cluster0.7epvq.mongodb.net/whatsappDb?retryWrites=true&w=majority";

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})

const pusher = new Pusher({
    appId: "1201741",
    key: "163612a7213d95a362bb",
    secret: "97004b697e7377d52a31",
    cluster: "mt1",
    useTLS: true,
});

mongoose.connect(connectionURL, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once("open", () => {
    console.log("db is connected");

    const msgCollection = db.collection("messagecontents");
    const changeStream = msgCollection.watch();

    changeStream.on("change", (change) => {
        console.log("A change occurred: ", change);

        if (change.operationType === "insert") {
            const messageDetails = change.fullDocument;
            pusher.trigger("messages", "inserted", {
                name: messageDetails.name,
                message: messageDetails.message,
            });
        } else {
            console.log("Error triggering Pusher");
        }
    });
});

app.get("/", (req, res) => res.status(200).send("server is running!"));

app.get("/messages/sync", (req, res) => {
    Messages.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    });
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
