CREATE TABLE IF NOT EXISTS autores (
    id                INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome              VARCHAR(150) NOT NULL,
    nacionalidade     VARCHAR(100),
    data_nascimento   DATE
);

CREATE TABLE IF NOT EXISTS livros (
    id                    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo                VARCHAR(200) NOT NULL,
    isbn                  VARCHAR(20) UNIQUE,
    ano_publicacao        SMALLINT,
    genero                VARCHAR(80),
    quantidade_estoque    INTEGER NOT NULL DEFAULT 0 CHECK (quantidade_estoque >= 0),
    autor_id              INTEGER NOT NULL REFERENCES autores (id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS clientes (
    id               INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome             VARCHAR(150) NOT NULL,
    cpf              VARCHAR(11) NOT NULL UNIQUE,
    email            VARCHAR(150) UNIQUE,
    telefone         VARCHAR(20),
    data_cadastro    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS emprestimos (
    id                          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    livro_id                    INTEGER NOT NULL REFERENCES livros (id) ON DELETE RESTRICT,
    cliente_id                  INTEGER NOT NULL REFERENCES clientes (id) ON DELETE RESTRICT,
    data_emprestimo             DATE NOT NULL DEFAULT CURRENT_DATE,
    data_prevista_devolucao     DATE NOT NULL,
    data_devolucao              DATE,
    status                      VARCHAR(20) NOT NULL DEFAULT 'em_andamento'
                                 CHECK (status IN ('em_andamento', 'devolvido', 'atrasado')),
    CONSTRAINT chk_devolucao_apos_emprestimo
        CHECK (data_devolucao IS NULL OR data_devolucao >= data_emprestimo),
    CONSTRAINT chk_previsao_apos_emprestimo
        CHECK (data_prevista_devolucao >= data_emprestimo)
);

CREATE TABLE IF NOT EXISTS usuario (
    id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome     VARCHAR(150) NOT NULL,
    cpf      VARCHAR(20) NOT NULL UNIQUE,
    email    VARCHAR(150) NOT NULL UNIQUE,
    login    VARCHAR(80) NOT NULL UNIQUE,
    senha    VARCHAR(255) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_livros_autor_id ON livros (autor_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_livro_id ON emprestimos (livro_id);
CREATE INDEX IF NOT EXISTS idx_emprestimos_cliente_id ON emprestimos (cliente_id);
