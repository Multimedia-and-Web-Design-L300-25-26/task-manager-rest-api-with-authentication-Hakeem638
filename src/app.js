import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import connectDB from "./config/db.js";

const app = express();

dotenv.config();

globalThis.mongoose = mongoose;

let dbReadyPromise;

const getDbReadyPromise = () => {
	if (!dbReadyPromise) {
		dbReadyPromise = connectDB().catch((error) => {
			dbReadyPromise = undefined;
			throw error;
		});
	}

	return dbReadyPromise;
};

if (process.env.NODE_ENV !== "test") {
	getDbReadyPromise().catch((error) => {
		console.error("Database connection failed:", error.message);
		process.exit(1);
	});
}

app.use(express.json());

app.use(async (req, res, next) => {
	try {
		await getDbReadyPromise();
		next();
	} catch (error) {
		res.status(500).json({ message: "Database not ready" });
	}
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;

