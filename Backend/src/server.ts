import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import adminRoutes from "./routes/admin";
import userRoutes from "./routes/user";
import restaurantRoutes from "./routes/restaurant";
import riderRoutes from "./routes/rider";
import menuCategoryRoutes from "./routes/menuCategory";
import paymentRoutes from "./routes/payment";
import notificationRoutes from "./routes/notification";
import contactRoutes from "./routes/contact";
import newsletterRoutes from "./routes/newsletter";
import otpRoutes from "./routes/otp";
import oauthRoutes from "./routes/oauth";
import jobsRoutes from "./routes/jobs";
import applicationsRoutes from "./routes/applications";
import uploadRoutes from "./routes/upload";

console.log("🔥 server.ts is running...");


dotenv.config();
const app = express();

// CORS configuration - allow production frontend only
app.use(
  cors({
    origin: [
      "https://www.chopnow.co.uk",
      "https://chopnow.co.uk",
      "http://localhost:3000", // Development
      "http://localhost:3001", // Development (alternative port)
    ],
    credentials: true,
  })
);


// Stripe webhook needs raw body, so add it before express.json()
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (make sure uploads directory exists)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  if (req.headers.authorization) {
    console.log(`🔑 Auth header: ${req.headers.authorization.substring(0, 20)}...`);
  }
  next();
});


app.get("/test", (req, res) => {
  console.log("🔥 /test route was called");
  res.send("✅ Express works");
});

app.get("/health", (req, res) => {
  console.log("🏥 /health route was called");
  res.json({
    status: "OK",
    version: "2.0.0-jobs-and-applications",
    timestamp: new Date().toISOString(),
    routes: {
      jobs: true,
      applications: true,
      upload: true
    }
  });
});


app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/rider", riderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/oauth", oauthRoutes);
app.use("/api", jobsRoutes);
app.use("/api", applicationsRoutes);
app.use("/api", uploadRoutes);

// Menu category and items routes
app.use("/api", menuCategoryRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
