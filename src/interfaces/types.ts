export interface PacienteInterface {
  id?: number;
  nome_completo: string;
  email: string;
  telefone: string;
  genero: string;
  data_nascimento: Date;
  cpf: string;
  cep: string;
  endereco: string;
}

export interface UserInterface {
  id?: number;
  nome_completo: string;
  email: string;
  senha_hash?: string;
  senha?: string;
  telefone: string;
  cpf: string;
  semestre: string;
  perfil_id: number;
}

export interface PerfilInterface {
  id?: number;
  nome: string;
}
