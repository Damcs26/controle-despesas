# 💰 Controle de Despesas

Sistema de controle de despesas e receitas desenvolvido com **ASP.NET Core (C#)** no backend e **React + TypeScript** no frontend.

---

## Tecnologias utilizadas

**Backend**
- C# / ASP.NET Core
- Entity Framework Core
- PostgreSQL
- Swagger

**Frontend**
- React + TypeScript
- Vite
- Axios
- React Router DOM

---

##  Estrutura do projeto
```
/controleDespesas
  /ControleDespesas       -> API REST em C#
    /Controllers          -> Recebem as requisições HTTP
    /Models               -> Entidades do banco de dados
    /DTOs                 -> Objetos de transferência de dados
    /Services             -> Regras de negócio
    /Repositories         -> Comunicação com o banco de dados
    /Data                 -> Configuração do DbContext
  /frontend               -> Interface em React + TypeScript
    /src
      /types              -> Interfaces TypeScript
      /services           -> Chamadas para a API
      /pages              -> Telas da aplicação
      /components         -> Componentes reutilizáveis
```

---

## Como rodar o projeto

### Pré-requisitos
- .NET 10
- Node.js
- PostgreSQL

### Backend

1. Crie um banco de dados PostgreSQL
2. Crie o arquivo `appsettings.json` em `/ControleDespesas` com suas credenciais:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=ControleDespesasDB;Username=seu_usuario;Password=sua_senha"
  }
}
```

3. Execute as migrations:
```bash
dotnet ef database update
```

4. Rode a API:
```bash
dotnet run
```

A API estará disponível em `https://localhost:7045`
O Swagger estará disponível em `https://localhost:7045/swagger`

### Frontend

1. Instale as dependências:
```bash
cd frontend
npm install
```

2. Rode o projeto:
```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

---

##  Funcionalidades

### Categorias
- Cadastro, edição, listagem e exclusão
- Finalidade: Despesa, Receita ou Ambas
- Totais de receitas, despesas e saldo por categoria

### Pessoas
- Cadastro, edição, listagem e exclusão
- Aviso automático para pessoas menores de 18 anos
- Totais de receitas, despesas e saldo por pessoa

### Transações
- Cadastro, edição, listagem e exclusão
- Vinculada a uma Pessoa e uma Categoria

---

##  Regras de negócio

- Pessoa menor de 18 anos só pode lançar **despesas**
- A categoria utilizada deve ser compatível com o tipo da transação:
  - Categoria com finalidade **Receita** não pode ser usada em uma transação do tipo **Despesa**
  - Categoria com finalidade **Despesa** não pode ser usada em uma transação do tipo **Receita**
  - Categoria com finalidade **Ambas** aceita qualquer tipo de transação
- Ao excluir uma pessoa, todas as suas transações são excluídas automaticamente
- O valor da transação deve ser maior que zero

---
## Rodando com Docker

Sobe tudo com um único comando:
```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- API: http://localhost:7045
- Swagger: http://localhost:7045/swagger

## 👩 Autora

Feito por **[Dâmaris Venâncio]**