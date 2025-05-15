import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url'; // Importar módulos necessários
import path from 'path'; // Importar módulos necessários

const app = express();
const port = 3000;

// Criar __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(bodyParser.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database('./usersdb.sqlite3', (err: Error | null) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite com sucesso!');
    }
});

// Chave secreta para JWT
const JWT_SECRET = 'your_jwt_secret_key';

// Tipagem para o retorno do banco de dados
interface User {
    id: number;
    email: string;
    password: string;
}

// Endpoint de login
app.post('/login', (req: Request, res: Response): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
        return;
    }

    db.get<User>('SELECT * FROM users WHERE email = ?', [email], (err: Error | null, row: User | undefined) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err.message);
            res.status(500).json({ message: 'Erro interno do servidor' });
            return;
        }

        if (!row) {
            res.status(401).json({ message: 'E-mail ou senha inválidos' });
            return;
        }

        if (row.password !== password) {
            res.status(401).json({ message: 'E-mail ou senha inválidos' });
            return;
        }

        const token = jwt.sign({ id: row.id, email: row.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, '../public')));

// Rota básica para o endpoint raiz
app.get('/', (req: Request, res: Response): void => {
    res.send('Bem-vindo à API de Fisioterapia!');
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});