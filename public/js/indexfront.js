const newsData = {
    1: {
        title: "Pas 3",
        content: `
            <p>A tão sonhada terceira edição do PAS para os alunos que estão cursando o 3º ano do ensino médio está chegando. Confira todas as informações sobre a inscrição e datas importantes.</p>
            
            <p>O Programa de Avaliação Seriada (PAS) é uma das formas mais esperadas pelos estudantes do 3º ano do ensino médio para ingressar na Universidade de Brasília (UnB). A terceira etapa, conhecida como PAS 3, representa o encerramento do ciclo de avaliações iniciado no 1º ano. Essa etapa é crucial, pois a nota acumulada nas três etapas é utilizada para a classificação e distribuição de vagas nos cursos de graduação da UnB.</p>
            
            <h3>Inscrições e Datas Importantes</h3>
            <p>As inscrições para o PAS 3 geralmente abrem no segundo semestre, com o edital contendo todas as orientações publicado no site oficial do Cebraspe. É essencial que os candidatos leiam o edital com atenção para não perderem prazos importantes, como:</p>
            <ul>
                <li>Período de inscrição (confirmar no edital atual).</li>
                <li>Prazo para solicitação de isenção da taxa de inscrição.</li>
                <li>Data da prova, geralmente no final do ano letivo.</li>
                <li>Divulgação do resultado, normalmente ocorre no início do ano seguinte.</li>
            </ul>
            
            <h3>Estrutura da Prova</h3>
            <p>A prova do PAS 3 é composta por:</p>
            <ul>
                <li>Questões objetivas abrangendo as disciplinas do ensino médio.</li>
                <li>Redação, que tem peso significativo na nota final.</li>
                <li>Leitura de obras obrigatórias, conforme lista publicada no edital.</li>
            </ul>
            <p>Certifique-se de revisar o conteúdo das duas etapas anteriores e se dedicar à leitura das obras literárias. A UnB valoriza a interdisciplinaridade, então é importante relacionar os temas estudados.</p>
            
            <h3>Dicas para uma Boa Preparação</h3>
            <ol>
                <li>Revise o material das etapas anteriores: Muitos conteúdos abordados nas etapas 1 e 2 podem ser cobrados de forma integrada no PAS 3.</li>
                <li>Faça simulados: O Cebraspe disponibiliza provas anteriores em seu site. Use esses materiais para treinar sua gestão de tempo e familiaridade com o estilo da prova.</li>
                <li>Fique atento às notícias: Acompanhe o site oficial e redes sociais do Cebraspe para não perder atualizações importantes.</li>
            </ol>
            
            <h3>Importância da Nota Final</h3>
            <p>O resultado acumulado das três etapas do PAS pode garantir uma vaga em um dos cursos da UnB sem a necessidade de realizar o vestibular tradicional ou usar a nota do ENEM. Essa é uma oportunidade única, principalmente para os alunos que têm um bom desempenho contínuo.</p>
            
            <p>Para mais informações, visite a página oficial do PAS no site do <a href="https://www.cebraspe.org.br/pas" target="_blank">Cebraspe</a> ou entre em contato com sua escola para orientações adicionais.</p>
            
            <h3>Motivação Final</h3>
            <p>Aproveite essa chance de ouro para conquistar seu lugar na UnB! O PAS não é apenas um processo seletivo, mas também uma forma de estimular o aprendizado ao longo do ensino médio. Boa sorte e sucesso nessa reta final! 🚀</p>
        `,
        image: "https://res.cloudinary.com/duslicdkg/image/upload/v1732756548/Images/download_z3qz8u.png",
    },
    
    
    2: {
        title: "Devolução dos livros",
        content: "Devolução obrigatória de livros para alunos do CEM 09. Evite multas e pendências devolvendo os materiais até o prazo estipulado.",
        image: "https://res.cloudinary.com/duslicdkg/image/upload/v1732756961/Images/livros_jjxayo.jpg",
    },
    3: {
        title: "Matrículas abertas para 2025",
        content: "O CEM 09 está com matrículas abertas para 2025. Não perca a chance de garantir sua vaga! Saiba mais sobre os documentos necessários e o processo de matrícula.",
        image: "https://res.cloudinary.com/duslicdkg/image/upload/v1732718779/Images/Matriculas_jfpi3c.webp",
    }
};
function showNews(id) {
    const newsContent = document.getElementById("newsContent");
    const newsDetails = document.getElementById("newsDetails");
    const mainContent = document.getElementById("mainContent");
    const news = newsData[id];

    if (news) {
        newsDetails.innerHTML = `
            <img src="${news.image}" alt="${news.title}">
            <h3>${news.title}</h3>
            <p>${news.content}</p>
        `;
        newsContent.style.display = "block";
        mainContent.style.display = "none";
    }
}

function hideNews() {
    const newsContent = document.getElementById("newsContent");
    const mainContent = document.getElementById("mainContent");

    newsContent.style.display = "none";
    mainContent.style.display = "block";
}
