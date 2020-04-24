<img alt="Contrete" src="https://images.sympla.com.br/5df91012c822a.png" />

<br/>
<h3 align="center">
  DESAFIO NODE.JS - CONCRETE
</h3>

<br/>
<p>Desafio que tem como proposta um backend que expoe uma API RESTful de sing up/sing in.<p/>

- **`POST /users`**: A rota deve receber `nome`, `email`, `senha`, e `telefones` dentro do corpo da requisição, sendo o `telefones` . Ao cadastrar uma nova transação, ela deve ser armazenada dentro de um banco de dados, possuindo os campos `id`, `name`, `email`, `token`, `ultimo_login`.
- **`POST /signIn`**: A rota deve receber `email` e `senha` e caso email e senha estejam cadastrados no banco, retornar o `id`, `name`, `email`, `token`, `ultimo_login`.
- **`GET /users/:id`**: A rota deve receber o id de um usuário  cadastrados no banco, e, caso o id exista retornar o `id`, `name`, `email`, `token`, `ultimo_login`. Para essa requisição é necessario enviar o token de autorização *Bearer Token* junto a requisição para ser possivel listar o usuário .

Existe a persistência de dados cadastrados na api atraves do **postgreSQL**. Ele foi escolhido por ter uma boa integração com o **Sequelize**, que é um ótimo ORM para NodeJS. Além disso, foi escolhido devido a integração gratuita que possue com o `Heroku`, que é onde foi hospedada a aplicação.

Nesse projeto já se encontra os testes realizados utilizando o **JEST** e todos os aquivos utilizados na aplicação, sendo possivel ver as dependencias utilizadas, como `ESLint` usado para o lint do codigo entre outros.

A aplicação esta hospedada no **[desafio-nodejs-concrete.herokuapp.com](https://desafio-nodejs-concrete.herokuapp.com/)**

Caso deseje rodar em ambiente local, é necessario possuir um banco de dados **postgreSQL** instalado (local ou uma imagem do docker) utilitando a porta `5432`. Assim basta fazer um `clone` desse repositorio e ao final rodar `yarn` para instalar as dependencias, `yarn sequelize db:migrate` para executar as migrations (alterações do banco de dados) e depois `yarn dev` para iniciar o servidor.


Feito com ❤️ by Tiago Felipe


