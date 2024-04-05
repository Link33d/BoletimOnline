const express = require("express");
const router = express.Router();
const path = require('path');
const ejs = require("ejs")
const fs = require("fs")
const db = require("../utils/database")

// Recebe um arquivo .ejs e renderiza, retornando um arquivo.html
function renderEJS(templateName, data) {
    const templatePath = path.join(process.cwd(), "views", `${templateName}.ejs`);
    const template = fs.readFileSync(templatePath, "utf-8");
    return ejs.render(template, data);
}

// Rota para listar os estudantes
// NOTA: Esta rota é apenas para fins de teste e apresentação. Listar os logins dos usuários publicamente é uma falha de segurança.
router.get("/getStudents", async (req, res) => {

    // Diretório onde os dados dos estudantes estão armazenados
    const dbDir = path.join(process.cwd(), "database", "studentName");

    // Variável para armazenar os dados dos estudantes
    let data = "";
 
    // Array com os nomes dos meses para formatação da data
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
 
    try {
        // Lê todos os arquivos na pasta "../database/studentName" e itera sobre cada arquivo
        await fs.readdirSync(dbDir).forEach(async f => {

            // Lê o conteúdo do arquivo
            let fileContent = await fs.readFileSync(path.join(dbDir,f), 'utf-8');
            
            // Divide o conteúdo em linhas
            fileContent = fileContent.split('\n')
            
            // Itera sobre cada linha do arquivo
            for (let student of fileContent) {
                // Divide a linha em colunas
                const columns = student.split(",");

                // Verifica se há dados válidos na linha
                if (columns.length >= 3) {
                    // Obtém o dia e o mês da célula de data
                    const day = columns[2].slice(0, 2);
                    const month = columns[2].slice(3, 5);

                    // Transforma o número do mês em texto
                    const monthText = months[parseInt(month) - 1]; // Subtrai 1 porque os meses começam em 0 no array
                    
                    // Formata a data e adiciona à string de dados
                    data += `${columns[1]}, ${day} de ${monthText}<br>`;
                }
            }

        });

    } catch (error) {
        // Em caso de erro, envia uma resposta de erro ao cliente
        console.error("Erro ao ler arquivos:", error);
        res.status(500).send("Erro ao obter dados dos estudantes.");
    }
    // Envia os dados formatados via HTML
    res.send(data);

})

// Acessa o banco de dados de devolve os dados de um usuário especifico
router.get("/getStudent", async (req, res) => {

    // Recebe as informações por query (URL?name=...&birthdate=...&type=...)
    let name = req.query.name;
    let birthdate = req.query.birthdate;
    let type = req.query.type || "json";

    // Verifica se 'name' e 'birthdate' foram fornecidos
    if (!name) return res.json({ success: false, errorType: 1, errorMessage: "É necessário informar o nome do aluno!" });
    if (!birthdate) return res.json({ success: false, errorType: 2, errorMessage: "É necessário informar a data de nascimento do aluno!" });

    /// Procura o aluno pelo nome no banco de dados
    let studentRow = await db.findStudent(name);

    // Verifica se o aluno existe e se a data de nascimento está correta
    if (!studentRow) return res.json({ success: false, errorType: 1, errorMessage: "Aluno não encontrado no banco de dados!" });
    if (studentRow[2] !== birthdate) return res.json({ success: false, errorType: 2, errorMessage: "Data de nascimento incorreta!" });

    try {
        
        // Busca os dados do aluno na base de dados de sua turma
        let classroom = await db.getStudentByClassroomData(studentRow);

        // Verifica se ocorreu algum erro ao obter os dados da turma do aluno
        if (!classroom) return res.json({success: false, errorType: 0, errorMessage: "Ocorreu um erro ao exibir seus dados, contate a equipe!"}) 
    
        // Extrai os índices das disciplinas do aluno na matriz de notas
        let disciplineIndexes = [1];
        for (let i = 1; i < classroom[0].length; i++) {
            disciplineIndexes.push(i * 3 + 1);
        }

        // Inicializa uma matriz para armazenar as notas do aluno por disciplina
        let gradePoints = [[], [], []];

        // Preenche a matriz de notas do aluno com as notas das disciplinas
        for (let index of disciplineIndexes) {
            
            gradePoints[0].push(classroom[1][index])
            gradePoints[1].push(classroom[1][index+1])
            gradePoints[2].push(classroom[1][index+2])

        }

        // Retorna os dados do aluno no formato especificado (JSON ou HTML)
        switch (type) {
            case "html":
                res.json({ 
                    success: true, 
                    response: renderEJS('table', {
                        student: studentRow, 
                        disciplines: classroom[0], 
                        gradePoints: gradePoints
                    }).toString()
                })
                break;
            case "json":
                res.json({ 
                    success: true, 
                    response: {
                        student: studentRow, 
                        disciplines: classroom[0], 
                        gradePoints: gradePoints
                    }
                })
                break;
        }
    } catch (error) {
        console.error("Erro ao processar solicitação do aluno:", error.message);
        res.status(500).json({ success: false, errorType: 0, errorMessage: "Erro interno ao processar a solicitação." });
    }

})

// Rota para a página inicial
router.get("/", (req, res) => {

    res.render("boletim", {page: "Boletim Online" })

});

module.exports = router;