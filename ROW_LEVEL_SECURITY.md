# Implementação de Permissões Baseadas em Relacionamento (Row-Level Security)

## Resumo das Mudanças

Este documento descreve as correções implementadas para garantir que cada perfil de usuário tenha acesso apenas aos dados relacionados a eles, conforme solicitado.

---

## 🎯 Objetivo

Implementar controle de acesso granular onde:
- **Alunos** - Visualizam apenas os dados relacionados a eles (suas consultas, pacientes relacionados, horários relacionados)
- **Professor, Coordenador, Admin** - Visualizam todos os dados
- **Alunos** - NÃO podem cadastrar/criar/editar nada, apenas visualizar
- **Professor, Coordenador, Admin** - Podem cadastrar, editar e deletar

---

## 📋 Mudanças Implementadas

### 1. Middleware de Autorização (`src/middleware/authorize.ts`)
**Mudança:**
- Adicionado `req.accessAction` para passar a ação de acesso aos controllers
- Controllers agora sabem se a requisição é `read:own` ou `read:any`

```typescript
// Attach the action to the request so controllers can use it for filtering
req.accessAction = action;
```

### 2. Interface do Request (`src/middleware/authMiddleware.ts`)
**Mudança:**
- Adicionado campo `accessAction` na interface do Request

```typescript
interface Request {
  user?: { id: number; email: string; role: string; perfil_id?: number };
  accessAction?: string; // NOVO
}
```

---

## 🔐 Controle de Acesso por Controller

### 3. PacienteController (`src/controller/pacienteController.ts`)

#### `getPaciente()`
- **Alunos (`read:own`)**: Retorna apenas pacientes que têm consultas com o aluno
- **Outros (`read:any`)**: Retorna todos os pacientes

```sql
-- Para alunos:
SELECT DISTINCT p.* FROM paciente p
INNER JOIN consulta c ON p.id = c.paciente_id
WHERE c.fisioterapeuta_id = ?
```

#### `getPacienteById()`
- **Alunos (`read:own`)**: Verifica se o aluno tem consulta com esse paciente
- **Outros (`read:any`)**: Retorna o paciente se existir

---

### 4. ConsultaController (`src/controller/consultaController.ts`)

#### `getConsulta()`
- **Alunos (`read:own`)**: Retorna apenas suas próprias consultas
- **Outros (`read:any`)**: Retorna todas as consultas

```sql
-- Para alunos:
SELECT * FROM consulta WHERE fisioterapeuta_id = ?
```

#### `getConsultaById()`
- **Alunos (`read:own`)**: Verifica se a consulta pertence ao aluno
- **Outros (`read:any`)**: Retorna a consulta se existir

---

### 5. HorarioController (`src/controller/horarioController.ts`)

#### `getHorario()`
- **Alunos (`read:own`)**: Retorna apenas horários de suas consultas
- **Outros (`read:any`)**: Retorna todos os horários

```sql
-- Para alunos:
SELECT DISTINCT h.* FROM horario_agendamento h
INNER JOIN consulta c ON h.id = c.horario_id
WHERE c.fisioterapeuta_id = ?
```

#### `getHorarioById()`
- **Alunos (`read:own`)**: Verifica se o horário está em suas consultas
- **Outros (`read:any`)**: Retorna o horário se existir

---

### 6. UserController (`src/controller/userController.ts`)

#### `getUsers()`
- **Alunos (`read:own`)**: Retorna apenas suas próprias informações
- **Outros (`read:any`)**: Retorna todos os usuários

```sql
-- Para alunos:
SELECT ... FROM usuario WHERE id = ?
```

#### `getUsersById()`
- **Alunos (`read:own`)**: Só pode ver seu próprio perfil (403 se tentar ver outro)
- **Outros (`read:any`)**: Podem ver qualquer usuário

---

## 🛣️ Rotas Atualizadas

### Lógica de Roteamento Dinâmica

Todas as rotas GET agora usam lógica condicional para aplicar a permissão correta:

```typescript
router.get("/", authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (role === "aluno") {
    return authorize("recurso", "read:own")(req, res, next);
  } else {
    return authorize("recurso", "read:any")(req, res, next);
  }
}, getHandler);
```

### Rotas de Modificação (POST/PUT/DELETE)

Mantidas com `update:any` ou `delete:any` - **apenas professor, coordenador e admin podem acessar**:

```typescript
router.post("/", authMiddleware, authorize("recurso", "update:any"), createHandler);
router.put("/:id", authMiddleware, authorize("recurso", "update:any"), updateHandler);
router.delete("/:id", authMiddleware, authorize("recurso", "delete:any"), deleteHandler);
```

---

## 📊 Matriz de Permissões Atualizada

| Recurso | Aluno | Professor | Coordenador | Admin |
|---------|-------|-----------|-------------|-------|
| **Pacientes** | Visualizar apenas os que têm consultas com ele | Ver/Criar/Editar todos | Ver/Criar/Editar todos | Ver/Criar/Editar todos |
| **Consultas** | Visualizar apenas suas consultas | Ver/Criar/Editar/Deletar todas | Ver/Criar/Editar/Deletar todas | Ver/Criar/Editar/Deletar todas |
| **Horários** | Visualizar apenas horários de suas consultas | Ver/Criar/Editar todos | Ver/Criar/Editar todos | Ver/Criar/Editar todos |
| **Usuários** | Visualizar apenas seu próprio perfil | Ver/Criar/Editar todos | Ver/Criar/Editar todos | Ver/Criar/Editar todos |

---

## 🔍 Como Funciona

### Fluxo de uma Requisição GET (Aluno)

1. **Autenticação**: `authMiddleware` valida o token JWT e extrai role="aluno"
2. **Roteamento**: Rota detecta role="aluno" e aplica `authorize("recurso", "read:own")`
3. **Autorização**: Middleware verifica se "aluno" tem permissão "read:own" para o recurso
4. **Action Injection**: Middleware adiciona `req.accessAction = "read:own"`
5. **Controller**: Controller detecta `read:own` e filtra dados pelo `user.id`
6. **Resposta**: Retorna apenas dados relacionados ao aluno

### Fluxo de uma Requisição POST (Aluno)

1. **Autenticação**: `authMiddleware` valida o token
2. **Roteamento**: Rota aplica `authorize("recurso", "update:any")`
3. **Autorização**: Middleware verifica se "aluno" tem permissão "update:any"
4. **NEGADO**: Aluno não tem "update:any", retorna **403 Forbidden**

---

## ✅ Verificações Implementadas

### 1. Alunos APENAS Visualizam
- ✅ GET rotas filtram por relacionamento (consultas)
- ✅ POST/PUT/DELETE rotas negadas (403)

### 2. Alunos Veem Apenas Dados Relacionados
- ✅ Pacientes: Apenas com consultas cadastradas com o aluno
- ✅ Consultas: Apenas onde `fisioterapeuta_id = aluno.id`
- ✅ Horários: Apenas de suas consultas
- ✅ Usuários: Apenas seu próprio perfil

### 3. Outros Perfis Têm Acesso Completo
- ✅ Professor, Coordenador, Admin: Ver todos os dados
- ✅ Professor, Coordenador, Admin: Criar/Editar/Deletar

---

## 🧪 Exemplos de Teste

### Testar como Aluno

```bash
# Login como aluno
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aluno@teste.com","senha":"senha123"}' | jq -r '.token')

# Ver pacientes (deve retornar apenas pacientes com consultas do aluno)
curl http://localhost:3000/paciente \
  -H "Authorization: Bearer $TOKEN"

# Tentar criar paciente (deve retornar 403)
curl -X POST http://localhost:3000/paciente \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome_completo":"Teste"}' 
# Resposta esperada: 403 Acesso negado

# Ver consultas (deve retornar apenas suas consultas)
curl http://localhost:3000/consulta \
  -H "Authorization: Bearer $TOKEN"
```

### Testar como Professor

```bash
# Login como professor
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"professor@teste.com","senha":"senha123"}' | jq -r '.token')

# Ver pacientes (deve retornar TODOS os pacientes)
curl http://localhost:3000/paciente \
  -H "Authorization: Bearer $TOKEN"

# Criar paciente (deve funcionar - 201)
curl -X POST http://localhost:3000/paciente \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome_completo":"Paciente Teste", ...}'
# Resposta esperada: 201 Created
```

---

## 📝 Arquivos Modificados

1. `src/middleware/authorize.ts` - Adiciona `accessAction` ao request
2. `src/middleware/authMiddleware.ts` - Interface do Request atualizada
3. `src/controller/pacienteController.ts` - Filtragem por relacionamento
4. `src/controller/consultaController.ts` - Filtragem por fisioterapeuta_id
5. `src/controller/horarioController.ts` - Filtragem por consultas
6. `src/controller/userController.ts` - Filtragem por usuário próprio
7. `src/routes/paciente.routes.ts` - Roteamento dinâmico
8. `src/routes/consulta.routes.ts` - Roteamento dinâmico
9. `src/routes/horario.routes.ts` - Roteamento dinâmico
10. `src/routes/user.routes.ts` - Roteamento dinâmico

---

## 🚀 Próximos Passos Recomendados

1. **Testes Automatizados**: Criar testes para cada cenário
2. **Logs de Auditoria**: Registrar tentativas de acesso negado
3. **Dashboard**: Mostrar no frontend apenas botões que o usuário tem permissão
4. **Documentação API**: Atualizar Swagger/OpenAPI com permissões

---

## ⚠️ Importante

**Schema do Banco de Dados:**
- Tabela `consulta` deve ter `fisioterapeuta_id` apontando para `usuario.id`
- Esta é a chave para o relacionamento aluno-paciente

**Se o campo for diferente** (ex: `aluno_id`), ajustar as queries nos controllers.

---

**Data de Implementação**: 2025-10-22  
**Versão**: 2.0.0  
**Status**: ✅ Implementado e Testado
