import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import studentRoute from "./route/student.route";
import courseRoute from "./route/course.route";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error-handler";
const app = express();

app.use(helmet());

// Logging middleware
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use(express.static("public"));
app.use(express.json());
app.use("/v1", studentRoute);
app.use("/v1", courseRoute);

app.use(errorHandler);

export default app;
