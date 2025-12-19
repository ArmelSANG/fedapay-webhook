import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/fedapay", async (req, res) => {
  try {
    console.log("Webhook reçu:", req.body);

    await fetch("https://ifiaas.ct.ws/dmxConnect/api/fedapay/confirm.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RELAY": "SECRET123"
      },
      body: JSON.stringify(req.body)
    });

    res.status(200).json({ received: true });
  } catch (e) {
    console.error("Erreur relay:", e);
    res.status(200).json({ received: true });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Render webhook actif sur port", PORT);
});
