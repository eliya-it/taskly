import express from "express";
import cors from "cors";
import AWS from "aws-sdk";
import router from "./src/routes/router";
import { errorController } from "@taskly/shared";
import cookieSession from "cookie-session";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import morgan from "morgan";
import { notFound } from "@taskly/shared";

const app = express();
// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
// Rate Limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 15 * 60 * 1000,
  message:
    "You have made too many requests in a short period. Please wait 15 minutes before trying again.",
});
app.use("/api", limiter);

// Prevent XSS
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Set Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Adjust if you use a CSP
  })
);

// Enable Gzip Compression
app.use(compression());

///////////////////////////////
/// General Middlewares
///////////////////////////////

app.use(express.json({ limit: "10kb" }));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
    httpOnly: true,
    sameSite: "lax",
  })
);

// Logging
app.use(morgan("combined"));

// Routes
app.use("/api/users", router);

///////////////////////////////
/// AWS Configuration
///////////////////////////////

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});
const cloudWatchOptions = {
  region: "us-east-1",
  credentials: new AWS.Credentials(
    process.env.AWS_ACCESS_KEY_ID!,
    process.env.AWS_SECRET_ACCESS_KEY!
  ),
};

///////////////////////////////
/// Error Handling
///////////////////////////////

app.all("*", notFound);
app.use(errorController(cloudWatchOptions));

export { app };
