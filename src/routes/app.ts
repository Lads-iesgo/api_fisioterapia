import express, { Request, Response, NextFunction } from "express";
const cors = require("cors");

import userRoutes from "./user.routes";
import clientRoutes from "./paciente.routes";
import perfilRoutes from "./perfil.routes";
import consultaRoutes from "./consulta.routes";
import horarioRoutes from "./horario.routes";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/usuario", userRoutes);
// app.use("/paciente", clientRoutes); // Exemplo para rotas de paciente
app.use("/perfil", perfilRoutes);
app.use("/consulta", consultaRoutes);
app.use("/horario", horarioRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
