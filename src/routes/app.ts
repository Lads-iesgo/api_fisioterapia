import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
const cors = require("cors");
import { prisma } from "../config/prisma";

import userRoutes from "./user.routes";
import clientRoutes from "./paciente.routes";
import perfilRoutes from "./perfil.routes";
import consultaRoutes from "./consulta.routes";
import horarioRoutes from "./horario.routes";
import authRoutes from "./auth.routes";
import registerRoutes from "./register.routes";
import indisponibilidadeRoutes from "./indisponibilidade.routes"

if (!process.env.JWT_SECRET) {
  throw new Error("A variável de ambiente JWT_SECRET não está definida.");
}
if (!process.env.DATABASE_URL) {
  throw new Error("A variável de ambiente DATABASE_URL não está definida.");
}

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API Fisioterapia está funcionando!" });
});

app.use("/usuario", userRoutes);
app.use("/paciente", clientRoutes);
app.use("/perfil", perfilRoutes);
app.use("/consulta", consultaRoutes);
app.use("/horario", horarioRoutes);
app.use("/auth", authRoutes);
app.use("/register", registerRoutes);
app.use("/indisponibilidade", indisponibilidadeRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({ message: err.message || "Internal Server Error" });
});

// Testa conexão com o banco via Prisma ao iniciar
(async () => {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco de dados bem-sucedida!");
    await prisma.$disconnect();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Erro ao conectar ao banco de dados:", error.message);
    } else {
      console.error("Erro ao conectar ao banco de dados:", error);
    }
    process.exit(1);
  }
})();

export default app;
