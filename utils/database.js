const path = require('path');
const fs = require("fs")

/**
 * Função para normalizar uma string removendo acentos, caracteres especiais e espaços,
 * e convertendo para letras minúsculas.
 * @param {string} string - A string a ser normalizada.
 * @returns {string} - A string normalizada.
 */
let normalizeString = (string) => {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/ /g, "");
}
// Exporta a função para ser utilizada em outros módulos
module.exports.normalizeString = normalizeString;

/**
 * Procura por um aluno no banco de dados pelo nome.
 * @param {string} studentName - O nome do aluno a ser procurado.
 * @returns {Array|null} - Retorna um array com os dados do aluno se encontrado, ou null caso contrário.
 */
module.exports.findStudent = async (studentName) => {

    // Define o caminho do arquivo com base no diretório do processo, a pasta 'database', e o nome do arquivo CSV
    const filePath = path.join(process.cwd(), "database", `studentName`, `${studentName.charAt(0).toUpperCase()}.csv`)
    
    // Variável para armazenar todos os dados dos alunos
    var allStudents;

    try {
        // Tenta ler o conteúdo do arquivo CSV
        allStudents = await fs.readFileSync(filePath, 'utf-8');
    } catch (e) {
        // Em caso de erro ao ler o arquivo, retorna null
        return null;
    }

    // Itera sobre cada linha do arquivo CSV
    for (let line of allStudents.split(/\r?\n/)) {
        // Divide a linha em colunas
        row = line.split(",")

        // Verifica se o nome do aluno, normalizado, corresponde ao nome fornecido
        if (normalizeString(row[1]) == normalizeString(studentName)) {

            // Se corresponder, retorna os dados do aluno
            return row;
        }
    };

    // Se nenhum aluno com o nome fornecido for encontrado, retorna null
    return null;
}

/**
 * Obtém os dados da turma de um aluno específico.
 * @param {Array} student - Um array contendo os dados do aluno ([ classe, nome, data de aniversário])
 * @returns {Array|null} - Retorna um array contendo os dados da turma do aluno se encontrado, ou null caso contrário.
 */
module.exports.getStudentByClassroomData = async (student) => {
    
    // Define o caminho do arquivo com base no diretório do processo, a pasta 'database', e o nome do arquivo CSV da turma
    const filePath = path.join(process.cwd(), "database", `classroom`, `${student[0].toUpperCase()}.csv`)
    
    let classroom

    try {
        // Tenta ler o conteúdo do arquivo CSV da turma
        classroom = await fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
        // Em caso de erro ao ler o arquivo, retorna null
        return null;
    }

    // Divide as linhas do arquivo em um array
    classroom = classroom.split('\n');
    
    // Filtra os dados da turma para encontrar o aluno específico
    let data = await classroom.filter(row => {
        row = row.split(',');

        // Verifica se o nome do aluno está incluído na linha (após normalizar as strings)
        if (normalizeString(row[0]).includes(normalizeString(student[1]))) {
            return row;
        }
    });

    // Se não houver dados encontrados para o aluno, retorna null
    if (data[0] == null) {
        return null;
    }

    // Retorna um array com os cabeçalhos das colunas e os dados do aluno encontrado na turma
    return [
        // Cabeçalhos das colunas
        classroom[0].split(','), 
        // Dados do aluno
        data[0].split(',')
    ];

}
