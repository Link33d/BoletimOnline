const fs = require("fs")
const path = require('path');

// Diretórios dos bancos de dados
const dbClassroomDir = path.join(process.cwd(), "database", "classroom")
const dbStudentDir = path.join(process.cwd(), "database", "studentName")

// Remove todos os arquivos do diretório de salas de aula e de alunos
fs.readdirSync(dbClassroomDir).forEach(f => fs.rmSync(`${dbClassroomDir}/${f}`));
fs.readdirSync(dbStudentDir).forEach(f => fs.rmSync(`${dbStudentDir}/${f}`));

// Listas de nomes e sobrenomes
const names = ['Ana', 'Amanda', 'André', 'Bruno', 'Camila', 'Carlos', 'Carolina', 'Fabiana', 'Felipe', 'Fernanda', 'Gabriel', 'Isabela', 'Jéssica', 'João', 'José', 'Juliana', 'Laura', 'Letícia', 'Lucas', 'Luiz', 'Marcelo', 'Maria', 'Paulo', 'Pedro', 'Renata', 'Ricardo', 'Rodrigo', 'Tatiane', 'Thiago', 'Vinícius']
const lastNames = ['Almeida', 'Araújo', 'Azevedo', 'Barbosa', 'Brito', 'Campos', 'Carneiro', 'Carvalho', 'Castro', 'Costa', 'Correia', 'Cunha', 'Dias', 'Fernandes', 'Ferreira', 'Fonseca', 'Freitas', 'Gomes', 'Gonçalves', 'Leal', 'Lima', 'Lopes', 'Menezes', 'Martins', 'Marques', 'Melo', 'Miranda', 'Monteiro', 'Moreira', 'Neves', 'Nunes', 'Oliveira', 'Pereira', 'Pinto', 'Ramos', 'Ribeiro', 'Rocha', 'Rodrigues', 'Sampaio', 'Santos', 'Silva', 'Siqueira', 'Soares', 'Souza', 'Vieira']

// Variáveis para armazenar dados temporários
const nameList = []
const nameObjects = {}
const classes = {}
const listsOfNames = []
const allNames = 200
const GroupAmount = 20 

// Função para obter um item aleatório de uma matriz
const getRandomItem = (array) => {
    return array[Math.floor(Math.random()*array.length)]
}

// Gerar nomes aleatórios
for (let i = 0; i < allNames; i++) {
    let name;
    let attempts = 0; // Contador de tentativas
    let maxAttempts = 100; // Limite do contador de tentativas
    // Loop para tentar gerar um nome único
    do {

        // Combinação aleatória de nomes da matriz 'names' e sobrenomes da matriz 'lastNames'
        name = getRandomItem(names) + " " + getRandomItem(lastNames) + " " + getRandomItem(lastNames);

        attempts++; // Incrementa o contador de tentativas

        if (attempts === maxAttempts) { // Se tentou todas vezes sem sucesso, quebra o loop
            break; // Sai do loop
        }
    } while (nameList.includes(name)); // Verifica se o nome já existe na lista

    if (attempts < maxAttempts) { // Se conseguiu gerar um nome único
        nameList.push(name); // Adiciona o nome único à lista
    } else {
        console.log(`Falha ao tentar gerar todos os ${allNames} nomes. A lista possui ${nameList.length} nomes!`); // Registra a falha ao gerar um nome exclusivo
        break; // Sai do loop
    }
}

// Itera sobre a lista de nomes gerados aleatoriamente
for (let nameIndex in nameList) {
    // Obtém o nome atual da lista
    let name = nameList[nameIndex]; 

    // Calcula o índice do grupo ao qual o nome atual pertence
    let groupIndex = Math.floor(nameIndex / GroupAmount);

    // Verifica se o grupo correspondente já existe em 'listsOfNames'
    if (!listsOfNames[groupIndex]) listsOfNames[groupIndex] = [];

    // Adiciona o nome atual ao grupo correspondente em 'listsOfNames'
    listsOfNames[groupIndex].push(name)

    // Gera aleatoriamente um mês para representar a data de aniversário
    let month = Math.floor(Math.random() * (12 - 1) + 1);

    // Determina o número máximo de dias com base no mês
    let maxDay = (month === 2) ? 28 : ([4, 6, 9, 11].includes(month) ? 30 : 31);

    // Gera aleatoriamente um dia dentro do intervalo válido para o mês
    let day = Math.floor(Math.random() * (maxDay - 1) + 1);

    // Formata o mês e o dia para terem dois dígitos
    month = (month.toString().length === 1) ? "0" + month : month;
    day = (day.toString().length === 1) ? "0" + day : day;

    // Gera o nome da classe com base no índice do grupo de nomes
    let className = `Class_${Math.floor(nameIndex / GroupAmount)}`;

    // Obtém a letra inicial do nome em maiúsculo
    let char = name.charAt(0).toUpperCase();

    // Verifica se a chave correspondente à letra inicial do nome existe em 'nameObjects'
    if (!nameObjects[char]) nameObjects[char] = [];

    // Armazena informações do aluno (nome, data de aniversário e nome da classe) em 'nameObjects'
    nameObjects[char].push(`${className},${name},${day + "" + month}`);

    // Inicializa um array para armazenar as notas do aluno
    let points = [];

    // Gera aleatoriamente notas para 33 disciplinas e as armazena em 'points'
    for (let i = 0; i <= 33; i++) points.push((Math.random() * 10).toFixed(1));

    // Verifica se a classe já existe em 'classes'
    if (!classes[className]) classes[className] = [];

    // Armazena informações do aluno (nome e notas) em 'classes' no formato CSV
    classes[className].push(`${name},${points.join(",")}`);
}

// Função assíncrona para escrever arquivos
let writeFile = async (filePath, content) => {
  // Retorna uma promise para operação de escrita do arquivo
  return new Promise((resolve, reject) => {
      // Escreve o arquivo
      fs.writeFile(filePath, content, err => {
          if (err) {
              // Em caso de erro, registra o erro no console
              console.log(`Erro ao salvar o arquivo: ${filePath}\n${err}`);
              reject(err); // Rejeita a promise caso haja erro
          } else {
              resolve(); // Resolve a promise caso não haja erro
          }
      });
  });
}

// Escrever arquivos CSV para listas de alunos
for (let key of Object.keys(nameObjects)) {
  const filePath = path.join(dbStudentDir, `${key}.csv`);

  // Escreve o arquivo CSV para listas de alunos
  writeFile(filePath, nameObjects[key].join("\n"));
}

// Escrever arquivos CSV para salas de aula
for (let key of Object.keys(classes)) {
  const filePath = path.join(dbClassroomDir, `${key}.csv`);
  let disciplines = "PORTUGUÊS,INGLÊS,EDUCAÇÃO FÍSICA,MATEMÁTICA,HISTÓRIA,GEOGRAFIA,FÍSICA,QUÍMICA,SOCIOLOGIA,FILOSOFIA,BIOLOGIA";

  // Escreve o arquivo CSV para salas de aula
  writeFile(filePath, `${disciplines}\n${classes[key].join("\n")}`);
}

console.log("Todo o banco de dados foi salvo!")