const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();
connectDB();

const app = express();

// ── Middleware ──────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(morgan("dev"));
app.use(helmet());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
