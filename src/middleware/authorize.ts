import { RequestHandler } from "express";

type Role = "aluno" | "professor" | "coordenador" | "admin";
type Resource = "paciente" | "horario" | "user";
type Action = "read:any" | "read:own" | "update:any" | "update:own" | "delete:any" | "delete:own";

const permissions:Record<Role, Record<Resource, Action[]>> = {
  aluno:{
    paciente: ["read:own"],
    horario: ["read:own"],
    user: ["read:own"],
  },
  professor: {
    paciente: ["read:any", "update:any", "delete:any"],	
    horario: ["read:any", "update:any", "delete:any"],
    user: ["read:any", "update:any", "delete:any"],
  },
  coordenador: {
    paciente: ["read:any", "update:any", "delete:any"],
    horario: ["read:any", "update:any", "delete:any"],
    user: ["read:any", "update:any", "delete:any"],
  },
  admin: {
    paciente: ["read:any", "update:any", "delete:any"],
    horario: ["read:any", "update:any", "delete:any"],
    user: ["read:any", "update:any", "delete:any"],
  },
};

const authorize = (resource: Resource, action: Action):RequestHandler => {
  return (req, res, next) => {
    const role = req.user?.role as Role | undefined;

    if (!role) {
      res.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    const allowed = permissions[role]?.[resource]?.includes(action);

    if (!allowed) {
      res.status(403).json({ message: "Acesso negado." });
      return;
    }

    next();
  };
};

export default authorize;