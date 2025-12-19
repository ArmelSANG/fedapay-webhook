const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const t = req.body.transaction;

    // Toujours répondre 200 à FedaPay
    if (!t) {
      return res.json({ received: true });
    }

    await fetch(
      "https://ifiaas.ct.ws/dmxConnect/api/fedapay/confirm.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RELAY": process.env.RELAY_SECRET
        },
        body: JSON.stringify({
          transaction_id: t.id,
          amount: t.amount,
          status: t.status
        })
      }
    );

    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.json({ received: true });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("Render webhook prêt sur port", PORT)
);
