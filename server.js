import express from 'express';


const app = express();
const port = process.env.PORT || 9000;


app.get('/', (req, res) => res.status(200).send("YO WHAT UP"));

app.listen(port, () => {
    console.log(`server is listening on port: ${port}`)
});
