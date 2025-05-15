import express, { Request, Response, NextFunction } from "express";

import userRoutes from "./user.routes";
import clientRoutes from "./paciente.routes";
import perfilRoutes from "./perfil.routes";
import horarioAgendamentoRoutes from "./horarioAgendamento.routes"; // Importe as novas rotas

const app = express();

app.use(express.json());

app.use("/usuario", userRoutes);
app.use("/paciente", clientRoutes);
app.use("/perfil", perfilRoutes);
app.use("/horario-agendamento", horarioAgendamentoRoutes); // Use as novas rotas

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

export default app;
