const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const qrcode = require("qrcode-terminal");
const bodyParser = require("body-parser");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: [ '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu', ]}
});
const app = express();
app.use(bodyParser.json());
bodyParser.urlencoded({ extended: true });

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR RECEIVED", qr);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

app.post("/send-message", (req, res) => {
  console.log(req.body);
  client.sendMessage(req.body.number, req.body.message).then((response) => {
    res.status(200).send(response);
  });
});

client.initialize();

app.listen(8000, function () {
  console.log("App running on port 8000");
});
