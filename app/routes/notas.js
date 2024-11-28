const db = require('../../config/db'); // Importa a configuração do banco de dados

module.exports = function (app, pool) {
    // Página de notas
    app.get("/notas", async (req, res) => {
        const user = req.session.user;

        if (!user) {
            return res.redirect("/login");
        }

        if (user.cargo === "professor") {
            try {
                // Query para buscar turmas associadas ao professor
                const turmas = await db.query(
                    `
                    SELECT DISTINCT t.id, t.nome
                    FROM Turmas t
                    JOIN Usuarios u ON u.turma_id = t.id
                    JOIN Professores_Materias pm ON pm.id_professor = $1
                    WHERE u.cargo = 'aluno' AND pm.id_materia IN (
                        SELECT id FROM Materias WHERE id = pm.id_materia
                    )
                    `,
                    [user.id]
                );
 
                res.render("notas", { user, turmas: turmas.rows });
            } catch (error) {
                console.error("Erro ao carregar turmas:", error);
                res.status(500).send("Erro ao carregar turmas.");
            }
        } else if (user.cargo === "aluno") {
            try {
                const materias = await db.query("SELECT id, nome FROM Materias");
                res.render("notas", { user, materias: materias.rows });
            } catch (error) {
                console.error("Erro ao carregar matérias:", error);
                res.status(500).send("Erro ao carregar matérias.");
            }
        } else {
            res.redirect("/");
        }
    });

    // API para buscar alunos de uma turma
    app.get("/api/turmas/:id/alunos", async (req, res) => {
        const { id } = req.params;

        try {
            // Busca alunos da turma selecionada
            const alunos = await db.query(
                "SELECT id, nome FROM Usuarios WHERE turma_id = $1 AND cargo = 'aluno'",
                [id]
            );

            res.json(alunos.rows);
        } catch (error) {
            console.error("Erro ao buscar alunos:", error);
            res.status(500).send("Erro ao buscar alunos.");
        }
    });

    // API para buscar notas de um aluno
    app.get("/api/alunos/:id/notas", async (req, res) => {
        const { id } = req.params;

        try {
            // Busca as notas do aluno, organizadas por bimestre
            const notas = await db.query(
                `
                SELECT bimestre, nota
                FROM Notas
                WHERE id_aluno = $1
                ORDER BY bimestre`,
                [id]
            );

            // Organiza as notas por bimestre, caso existam
            const notasPorBimestre = [1, 2, 3, 4].map(bimestre => {
                const nota = notas.rows.find(n => n.bimestre === bimestre);
                return { bimestre, nota: nota ? nota.nota : null };
            });

            res.json(notasPorBimestre);
        } catch (error) {
            console.error("Erro ao buscar as notas do aluno:", error);
            res.status(500).send("Erro ao buscar as notas.");
        }
    });

    // API para atribuir notas
    app.post("/api/alunos/:id/notas", async (req, res) => {
        const { id } = req.params;
        const { notas } = req.body; // Dados das notas (bimestres)
        const user = req.session.user;
    
        if (!user || user.cargo !== "professor") {
            return res.status(403).send("Acesso negado.");
        }
    
        if (!Array.isArray(notas) || notas.length === 0) {
            return res.status(400).send("Notas inválidas.");
        }
    
        // Logar as notas que chegaram ao backend
        console.log("Notas recebidas do frontend:", notas);
    
        try {
            // Deleta as notas existentes antes de atribuir novas
            await db.query("DELETE FROM Notas WHERE id_aluno = $1 AND id_professor = $2", [id, user.id]);
    
            // Para cada nota, salva no banco
            for (const { bimestre, nota } of notas) {
                // Verifica se a nota é válida
                if (isNaN(nota) || bimestre < 1 || bimestre > 4) {
                    return res.status(400).send("Nota inválida para o bimestre " + bimestre);
                }
    
                await db.query(
                    "INSERT INTO Notas (id_professor, id_aluno, id_materia, nota, data) VALUES ($1, $2, $3, $4, NOW())",
                    [user.id, id, req.session.materia_id, nota]
                );
            }
            console.log("Notas recebidas do frontend:", notas);
            res.status(201).send("Notas salvas.");
        } catch (error) {
            console.error("Erro ao salvar as notas:", error);
            res.status(500).send("Erro ao salvar notas.");
        }
    });

    

    
};
