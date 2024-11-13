-- 1. Deleta o banco de dados caso já exista
DROP DATABASE IF EXISTS Escola;
CREATE DATABASE Escola;

-- 2. Seleciona o banco de dados para uso
USE Escola;

-- 3. Tabela para os Usuários (Alunos, Professores e Direção)
CREATE TABLE Usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL, -- Senha deve ser armazenada de forma segura
    cargo ENUM('aluno', 'professor', 'direcao') NOT NULL,
    token_direcao VARCHAR(255), -- Apenas para professores que têm uma direção associada
    data_nascimento DATE, -- Apenas para alunos
    UNIQUE (token_direcao) -- Garante que o token para direção seja único
);

-- 4. Tabela para as Notas dos Alunos
CREATE TABLE Notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_professor INT NOT NULL,
    id_aluno INT NOT NULL,
    nota DECIMAL(5,2) NOT NULL,
    materia VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    FOREIGN KEY (id_professor) REFERENCES Usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (id_aluno) REFERENCES Usuarios(id) ON DELETE CASCADE
);

-- 5. Inserir dados de exemplo para um Administrador (Direção)
INSERT INTO Usuarios (nome, email, senha, cargo, token_direcao)
VALUES ('Miguel', 'migueltest@gmail.com', '123', 'direcao', '084880');

-- 6. Inserir dados de exemplo para um Professor
INSERT INTO Usuarios (nome, email, senha, cargo, token_direcao)
VALUES ('Professor João', 'joao@escola.com', 'senha123', 'professor', '084880');

-- 7. Inserir dados de exemplo para um Aluno
INSERT INTO Usuarios (nome, email, senha, cargo, data_nascimento)
VALUES ('Carlos Silva', 'carlos@escola.com', '123', 'aluno', '2005-02-15');

-- 8. Inserir dados de exemplo para as Notas
INSERT INTO Notas (id_professor, id_aluno, nota, materia, data)
VALUES (2, 1, 8.5, 'Matemática', '2024-11-07');

-- 9. Consultar todos os usuários
SELECT * FROM Usuarios;

-- 10. Consultar todas as notas
SELECT * FROM Notas;

-- 11. Consulta unificada para ver informações de usuários e suas notas
SELECT 
    u.id AS usuario_id,
    u.nome AS usuario_nome,
    u.email AS usuario_email,
    u.cargo AS usuario_cargo,
    n.nota,
    n.materia,
    n.data
FROM 
    Usuarios u
LEFT JOIN 
    Notas n ON u.id = n.id_aluno OR u.id = n.id_professor;
