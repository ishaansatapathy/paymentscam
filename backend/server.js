import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Mock UPI check endpoint
app.post("/check", (req, res) => {
  const { upiId } = req.body;

  // Simple fake check logic
  if (!upiId || upiId.length < 5) {
    return res.json({ safe: false, message: "Invalid UPI ID" });
  }

  if (upiId.includes("scam") || upiId.includes("fraud")) {
    return res.json({ safe: false, message: "⚠️ Suspicious UPI detected" });
  }

  res.json({ safe: true, message: "✅ Safe UPI ID" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
