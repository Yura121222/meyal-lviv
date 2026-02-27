const express = require("express");
const path = require("path");
const { Resend } = require("resend");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/contact", async (req, res) => {
  try {
    const { name, phone, message } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ ok: false, error: "name and phone required" });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !toEmail) {
      return res.status(500).json({ ok: false, error: "Email is not configured on server" });
    }

    const resend = new Resend(apiKey);

    const safeName = String(name).slice(0, 120);
    const safePhone = String(phone).slice(0, 80);
    const safeMessage = String(message || "").slice(0, 2000);

    await resend.emails.send({
      from: "Metal Lviv <onboarding@resend.dev>",
      to: [toEmail],
      subject: `Заявка: ${safeName} (${safePhone})`,
      text:
        `Нова заявка з сайту\n\n` +
        `Ім'я: ${safeName}\n` +
        `Телефон: ${safePhone}\n` +
        `Повідомлення: ${safeMessage || "-"}\n`,
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));