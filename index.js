const { Client } = require("whatsapp-web.js");
const express = require("express");
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');

const client = new Client(
  {
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2413.51-beta.html",
    },
  }
);
const app = express();
app.use(bodyParser.json());
bodyParser.urlencoded({ extended: true });

client.on("qr", (qr) => {
  qrcode.generate(qr, {small: true});
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
