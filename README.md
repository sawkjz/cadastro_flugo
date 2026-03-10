# Cadastro de Colaboradores — Desafio Flugo

Formulário multi-step para cadastro de colaboradores, desenvolvido com **ReactJS + TypeScript**, **Material UI** e **Firebase Firestore**, seguindo o protótipo Figma fornecido.

## Funcionalidades

- **Dashboard** com tabela de colaboradores (Nome, Email, Departamento, Status)
- **Ordenação** por qualquer coluna clicando no cabeçalho
- **Formulário multi-step** com 2 etapas:
  - Etapa 1 — Informações Básicas (Título, E-mail, Ativar ao criar)
  - Etapa 2 — Informações Profissionais (Departamento)
- **Stepper vertical** à esquerda com barra de progresso e porcentagem
- **Validação** por etapa com feedback visual (todos os campos required)
- **Persistência** dos dados no Firebase Firestore
- **Breadcrumb** de navegação
- **Sidebar** fixa com logo Flugo e menu lateral
- **Badges** coloridos de status (Ativo / Inativo)
- **Avatares** com iniciais e cores automáticas

## Tecnologias

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Material UI v6](https://mui.com/)
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- [Firebase Firestore](https://firebase.google.com/docs/firestore)
- [React Router v6](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)

## Como rodar localmente

### Pré-requisitos

- **Node.js** 18 ou superior
- **npm** 9 ou superior
- Uma conta no [Firebase](https://console.firebase.google.com/)

### 1. Clone o repositório

```bash
git clone https://github.com/LeoCorreaa/Agua.git
cd Agua
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o Firebase

#### 3.1 — Crie o projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"** e siga os passos
3. No menu lateral, clique em **Firestore Database** → **"Criar banco de dados"**
4. Selecione **modo de teste** (permite leitura/escrita sem autenticação)
5. Escolha a região e clique em **"Ativar"**

#### 3.2 — Registre um app Web

1. Na página do projeto, clique no ícone **`</>`** (Web) para adicionar um app
2. Dê um apelido (ex: "Flugo") e clique em **"Registrar app"**
3. Copie o objeto `firebaseConfig` exibido

#### 3.3 — Crie o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env` (pode copiar do exemplo):

```bash
cp .env.example .env
```

Preencha com os valores copiados do Firebase:

```env
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto-id
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

#### 3.4 — Verifique as regras do Firestore

No Firebase Console → Firestore Database → **Regras**, as regras devem estar assim:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> Regras com `if true` são apenas para desenvolvimento/teste. Em produção, adicione autenticação.

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Abra **http://localhost:5173** no navegador.

## 📦 Build para produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## Deploy na Vercel

1. Acesse [vercel.com](https://vercel.com/) e conecte sua conta GitHub
2. Importe o repositório **Agua**
3. Em **Environment Variables**, adicione todas as variáveis `VITE_FIREBASE_*` do seu `.env`
4. Clique em **Deploy**

## 📁 Estrutura do projeto

```
src/
├── components/
│   ├── Layout.tsx              # Layout principal com sidebar + top bar
│   ├── Sidebar.tsx             # Sidebar com logo Flugo e navegação
│   └── steps/
│       ├── BasicInfoStep.tsx   # Etapa 1: Título, Email, Toggle
│       └── ProfessionalStep.tsx # Etapa 2: Departamento
├── pages/
│   ├── Dashboard.tsx           # Tabela de colaboradores
│   └── CadastroColaborador.tsx # Form multi-step com stepper
├── firebase/
│   ├── config.ts               # Inicialização do Firebase
│   └── employeeService.ts      # CRUD Firestore
├── schemas/
│   └── employeeSchema.ts       # Schemas Zod
├── types/
│   └── employee.ts             # Tipos TypeScript
├── App.tsx                     # Rotas + tema MUI
└── main.tsx                    # Entry point
```

## 🗂️ Estrutura dos dados no Firestore

Cada documento salvo na coleção `colaboradores` contém:

```json
{
  "titulo": "string",
  "email": "string",
  "ativoAoCriar": true,
  "departamento": "string",
  "criadoEm": "Timestamp"
}
```
