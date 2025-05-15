import express, { Request, Response, NextFunction } from "express";

import userRoutes from "./user.routes";
import clientRoutes from "./client.routes";

const app = express();

app.use(express.json());

app.use("/clientes", clientRoutes);
app.use("/usuarios", userRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
