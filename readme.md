# Boletim Online

O Boletim Online é uma aplicação web que permite aos alunos do meu colégio acessar suas respectivas notas de forma prática e rápida. Desenvolvi este site para facilitar o acesso às informações acadêmicas, e ele foi implementado com sucesso para aproximadamente 700 alunos!

O site originalmente utilizava a API do Google Sheets para baixar as notas das planilhas dos professores e converter os arquivos do formato Excel para arquivos CSV. Porém, devido à necessidade de proteger a privacidade dos alunos, criei uma aplicação Node.js chamada [utils/GenerateRandomDB.js](utils/GenerateRandomDB.js). Essa aplicação gera bancos de dados de alunos e salas de aula com nomes aleatórios e informações simuladas de notas e datas de nascimento. Você pode configurar o tamanho das salas e a quantidade total de alunos. Os arquivos CSV são gerados nos diretórios [database/studentName](database/studentName) e [database/studentName](database/studentName).

Para facilitar os testes, disponibilizei todos os possíveis logins em http://localhost:3000/boletimonline/getStudents (não disponível na versão do site por motivos de segurança).

## Requisitos

- Node.js instalado na máquina (v14 ou superior)
- NPM (Node Package Manager) ou Yarn

# Tecnologias Utilizadas
- Node.js: O servidor é construído com Node.js para facilitar a comunicação entre o cliente e o servidor.
- Express.js: Framework Node.js utilizado para criar o servidor web e a API REST.
- FileSystem (fs): Módulo Node.js usado para interagir com o sistema de arquivos para ler e gravar arquivos CSV.
- Path: Módulo Node.js para manipulação de caminhos de arquivo.
- JavaScript (ES6+): Usado para escrever lógica de backend e frontend.
- EJS/CSS: Usado para criar o frontend da aplicação web.

## Como Usar

1. **Instalação**:
   - Certifique-se de ter o Node.js instalado em sua máquina.
   - Clone este repositório para o seu ambiente local.

2. **Instalação de Dependências**:
   - Navegue até o diretório raiz do projeto no terminal.
   - Execute `npm install` para instalar todas as dependências do projeto.

3. **Gerar Banco de Dados**:
   - Utilize o arquivo [utils/GenerateRandomDB.js](utils/GenerateRandomDB.js) para gerar um banco de dados de alunos e salas de aula.
   - Configure os parâmetros necessários, como o número de alunos e o tamanho da turma.

4. **Iniciar o Servidor**:
   - Execute `npm start` para iniciar o servidor.
   - O servidor será iniciado na porta padrão `3000`.

5. **Acessar o Servidor**:
   - Abra o navegador e vá para `http://localhost:3000` para acessar o servidor.
   - Você pode acessar as notas dos alunos e as informações da sala de aula.

## Detalhes

1. **Banco de dados**
- Pode ser encontrado no diretório [database](database)
- Pode ser gerado quantas vezes quiser através do [utils/GenerateRandomDB.js](utils/GenerateRandomDB.js)
- É lido e interpretado através do arquivo [utils/database.js](utils/database.js)

2. **Backend** 
- A rota principal está em [index.js](index.js)
- A lógica por trás de toda API de envio de nota está em [routers/boletim.js](routers/boletim.js)

3. **Frontend**
- Todos os arquivos de frontend estão em [views](views), e os de estilização em [public/css](public/css)
- O arquivo que recebe as informações do usuário e procura na API pode ser encontrado em [views/boletim.ejs](views/boletim.ejs)
- O arquivo que recebe a resposta da API e interpreta o objeto JSON de notas pode ser encontrado em [views/table.ejs](views/table.ejs)

## Contribuição

Contribuições são bem-vindas! Sou um estudante de programação de 16 anos e tenho muito a aprender com possíveis erros cometidos por mim. Sinta-se à vontade para enviar pull requests para correções de bugs, melhorias de código ou novos recursos.

## Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).