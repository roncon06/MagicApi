## TRABALHO DESAFIO PROFISSIONAL

## Pré-Requisitos
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MAGIC](https://api.magicthegathering.io/v1) 

## Iniciando o projeto

```bash
$  git clone https://github.com/roncon06/MagicApi.git
```  

## Configurando a aplicação:
1. Fazer uma cópia do `.env.example` para `.env`, e preencher a informação da conexão com banco de dados.
2. Instale as dependências: 
```bash 
npm install
```

## Inicializando a aplicação:

Inicializando normalmente: 
```bash
npm run start
```

## Rodando os testes
Rodando testes: 
```bash
npm run test:e2e
```
Rodando teste de carga:
```bash
artillery run load-test.yml

```

## Documentação/Endpoints 📰

Foi disponibilizado os arquivos de environment e collection da ferramenta [insomnia]contendo todos os endpoints feitos neste projeto.






### DECKS

**GET /commander/:commanderName**: Cria o deck com o comandante e suas cartas
**GET /commander/decks/all**: Retornar todos os decks criado

### User

**POST /users**: Cria um novo usuário.
**POST /auth/login**: Autentica o usuário.  
**GET /users/:username**: Retorna um usuário específico pelo username.  
**PUT /users/:username**: Atualiza um usuário pelo username.  
**DELETE /users/:username**: Remove um usuário pelo usarname.

---
