document.addEventListener("DOMContentLoaded", () => {
    console.log("Página carregada, script executado");
    const turmasList = document.querySelector("#turmas-list");
    const alunosContainer = document.querySelector("#alunos-container");

    // Quando o professor clicar em uma turma, buscar os alunos dessa turma
    turmasList.addEventListener("click", async (e) => {
        if (e.target.tagName === "LI") {
            const turmaId = e.target.dataset.id;

            // Fazer uma requisição para buscar os alunos da turma
            try {
                const alunosResponse = await fetch(`/api/turmas/${turmaId}/alunos`);
                if (!alunosResponse.ok) {
                    console.error('Erro ao carregar alunos:', alunosResponse.statusText);
                    return;
                }
                const alunos = await alunosResponse.json();

                if (alunos.length === 0) {
                    alunosContainer.innerHTML = "<p>Não há alunos na turma.</p>";
                    return;
                }

                // Limpar os alunos anteriores no container
                alunosContainer.innerHTML = "";
                // Preencher o container com os alunos
                for (let aluno of alunos) {
                    // Fazer uma requisição para buscar as notas do aluno
                    try {
                        const notasResponse = await fetch(`/api/alunos/${aluno.id}/notas`);
                        if (!notasResponse.ok) {
                            console.error('Erro ao carregar notas:', notasResponse.statusText);
                            return;
                        }

                        const notas = await notasResponse.json();

                        const div = document.createElement("div");
                        div.innerHTML = `
                            <h4>${aluno.nome}</h4>
                            <form class="nota-form" data-aluno-id="${aluno.id}">
                                <label for="nota1">1º Bimestre:</label>
                                <input type="number" id="nota1" name="nota1" step="0.1" value="${notas[0] ? notas[0].nota : ''}">
                                <label for="nota2">2º Bimestre:</label>
                                <input type="number" id="nota2" name="nota2" step="0.1" value="${notas[1] ? notas[1].nota : ''}">
                                <label for="nota3">3º Bimestre:</label>
                                <input type="number" id="nota3" name="nota3" step="0.1" value="${notas[2] ? notas[2].nota : ''}">
                                <label for="nota4">4º Bimestre:</label>
                                <input type="number" id="nota4" name="nota4" step="0.1" value="${notas[3] ? notas[3].nota : ''}">
                                <button type="submit">Salvar</button>
                            </form>
                        `;
                        alunosContainer.appendChild(div);
                    } catch (error) {
                        console.error('Erro ao carregar as notas do aluno:', error);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar alunos da turma:', error);
            }
        }
    });

    // Salvar as notas
// Salvar as notas
alunosContainer.addEventListener("submit", async (e) => {
    if (e.target.classList.contains("nota-form")) {
        e.preventDefault();

        const alunoId = e.target.dataset.alunoId;
        const nota1 = e.target.querySelector("input[name='nota1']").value;
        const nota2 = e.target.querySelector("input[name='nota2']").value;
        const nota3 = e.target.querySelector("input[name='nota3']").value;
        const nota4 = e.target.querySelector("input[name='nota4']").value;

        // Garantir que as notas sejam enviadas como um array de objetos
        const notas = [
            { bimestre: 1, nota: parseFloat(nota1) || null },
            { bimestre: 2, nota: parseFloat(nota2) || null },
            { bimestre: 3, nota: parseFloat(nota3) || null },
            { bimestre: 4, nota: parseFloat(nota4) || null }
        ];

        // Verificar se as notas estão sendo enviadas corretamente
        console.log("Dados a serem enviados para o servidor:", { alunoId, notas });

        try {
            const response = await fetch(`/api/alunos/${alunoId}/notas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ notas }) // Envia o array de notas
            });

            // Verifique a resposta do servidor
            const responseData = await response.json();
            console.log("Resposta do servidor:", responseData); // Logar a resposta do servidor

            if (response.ok) {
                alert("Notas salvas com sucesso!");
            } else {
                alert("Erro ao salvar notas.");
            }
        } catch (error) {
            console.error('Erro ao salvar as notas:', error);
        }
    }
});

})
