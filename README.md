# FrontendBR Statistics

Esse projeto tem como objetivo de listar as pessoas que mais contribuíram no [fórum do FrontendBR](https://github.com/frontendbr/forum).

Pra executar a query e listar os usuários:

1. Você precisa de um token de autorização pra consumir o GraphQL do GitHub e colocar o valor dentro do seu arquivo `.env`. Para iniciar, faça `cp .env.development .env` e altere o valor da chave dentro do arquivo `.env`;
2. Executar o comando `node index.js`;
3. Visitar http://localhost:9000 e aguardar os dados serem populados na tela.

A porta 9000 é default. Se precisar subir em outra porta, basta passar a env `PORT=7700 node index.js`. Ou se preferir, colocar o valor `PORT=7700` no seu `.env`.
