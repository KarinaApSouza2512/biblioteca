import 'dotenv/config'

import { pool } from './database'

interface AutorSeed {
  nome: string
  nacionalidade: string
  dataNascimento: string
}

interface LivroSeed {
  titulo: string
  isbn: string
  anoPublicacao: number
  genero: string
  quantidadeEstoque: number
  autorNome: string
}

interface ClienteSeed {
  nome: string
  cpf: string
  email: string
  telefone: string
}

interface UsuarioSeed {
  nome: string
  cpf: string
  email: string
  login: string
  senha: string
}

interface EmprestimoSeed {
  livroTitulo: string
  clienteCpf: string
  dataEmprestimo: string
  dataPrevistaDevolucao: string
  dataDevolucao: string | null
  status: 'em_andamento' | 'devolvido' | 'atrasado'
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function daysFromToday(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return formatDate(date)
}

const autoresSeed: AutorSeed[] = [
  {
    nome: 'Machado de Assis',
    nacionalidade: 'Brasileira',
    dataNascimento: '1839-06-21'
  },
  {
    nome: 'Clarice Lispector',
    nacionalidade: 'Brasileira',
    dataNascimento: '1920-12-10'
  },
  {
    nome: 'George Orwell',
    nacionalidade: 'Britanica',
    dataNascimento: '1903-06-25'
  },
  {
    nome: 'Mauricio de Sousa',
    nacionalidade: 'Brasileira',
    dataNascimento: '1935-10-27'
  }
]

const livrosSeed: LivroSeed[] = [
  {
    titulo: 'Dom Casmurro',
    isbn: '9788535914849',
    anoPublicacao: 1899,
    genero: 'Romance',
    quantidadeEstoque: 4,
    autorNome: 'Machado de Assis'
  },
  {
    titulo: 'Memorias Postumas de Bras Cubas',
    isbn: '9788535909555',
    anoPublicacao: 1881,
    genero: 'Romance',
    quantidadeEstoque: 2,
    autorNome: 'Machado de Assis'
  },
  {
    titulo: 'A Hora da Estrela',
    isbn: '9788535922639',
    anoPublicacao: 1977,
    genero: 'Ficcao',
    quantidadeEstoque: 3,
    autorNome: 'Clarice Lispector'
  },
  {
    titulo: '1984',
    isbn: '9788535914840',
    anoPublicacao: 1949,
    genero: 'Distopia',
    quantidadeEstoque: 5,
    autorNome: 'George Orwell'
  },
  {
    titulo: 'Turma da Monica - Licoes',
    isbn: '9788542608854',
    anoPublicacao: 2015,
    genero: 'Quadrinhos',
    quantidadeEstoque: 6,
    autorNome: 'Mauricio de Sousa'
  },
  {
    titulo: 'Turma da Monica - Lacos',
    isbn: '9788542608861',
    anoPublicacao: 2013,
    genero: 'Quadrinhos',
    quantidadeEstoque: 5,
    autorNome: 'Mauricio de Sousa'
  }
]

const clientesSeed: ClienteSeed[] = [
  {
    nome: 'Marco Antonio de Nez',
    cpf: '12345678909',
    email: 'marco.antonio@example.com',
    telefone: '47999990001'
  },
  {
    nome: 'Arthur de Souza Padilha',
    cpf: '98765432100',
    email: 'arthur.padilha@example.com',
    telefone: '47999990002'
  },
  {
    nome: 'Alice de Souza Padilha',
    cpf: '52998224725',
    email: 'alice.padilha@example.com',
    telefone: '47999990003'
  }
]

const usuariosSeed: UsuarioSeed[] = [
  {
    nome: 'Administrador',
    cpf: '11122233344',
    email: 'admin@biblioteca.local',
    login: 'admin',
    senha: 'admin123'
  },
  {
    nome: 'Karina Aparecida de Souza',
    cpf: '22233344455',
    email: 'karina@biblioteca.local',
    login: 'karina',
    senha: '123456'
  }
]

const emprestimosSeed: EmprestimoSeed[] = [
  {
    livroTitulo: 'Dom Casmurro',
    clienteCpf: '12345678909',
    dataEmprestimo: daysFromToday(-3),
    dataPrevistaDevolucao: daysFromToday(4),
    dataDevolucao: null,
    status: 'em_andamento'
  },
  {
    livroTitulo: '1984',
    clienteCpf: '98765432100',
    dataEmprestimo: daysFromToday(-15),
    dataPrevistaDevolucao: daysFromToday(-5),
    dataDevolucao: daysFromToday(-4),
    status: 'devolvido'
  },
  {
    livroTitulo: 'A Hora da Estrela',
    clienteCpf: '52998224725',
    dataEmprestimo: daysFromToday(-12),
    dataPrevistaDevolucao: daysFromToday(-2),
    dataDevolucao: null,
    status: 'atrasado'
  },
  {
    livroTitulo: 'Turma da Monica - Lacos',
    clienteCpf: '12345678909',
    dataEmprestimo: daysFromToday(-1),
    dataPrevistaDevolucao: daysFromToday(6),
    dataDevolucao: null,
    status: 'em_andamento'
  }
]

async function seed(): Promise<void> {
  const client = await pool.connect()

  try {
    console.log('Iniciando seed de demonstracao...')

    await client.query('BEGIN')

    await client.query(
      'TRUNCATE TABLE emprestimos, livros, autores, clientes, usuario RESTART IDENTITY CASCADE'
    )

    const autorIdByNome = new Map<string, number>()

    for (const autor of autoresSeed) {
      const { rows } = await client.query<{ id: number }>(
        'INSERT INTO autores (nome, nacionalidade, data_nascimento) VALUES ($1, $2, $3) RETURNING id',
        [autor.nome, autor.nacionalidade, autor.dataNascimento]
      )

      autorIdByNome.set(autor.nome, rows[0].id)
    }

    const livroIdByTitulo = new Map<string, number>()

    for (const livro of livrosSeed) {
      const autorId = autorIdByNome.get(livro.autorNome)

      if (!autorId) {
        throw new Error(`Autor nao encontrado no seed: ${livro.autorNome}`)
      }

      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO livros
          (titulo, isbn, ano_publicacao, genero, quantidade_estoque, autor_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          livro.titulo,
          livro.isbn,
          livro.anoPublicacao,
          livro.genero,
          livro.quantidadeEstoque,
          autorId
        ]
      )

      livroIdByTitulo.set(livro.titulo, rows[0].id)
    }

    const clienteIdByCpf = new Map<string, number>()

    for (const cliente of clientesSeed) {
      const { rows } = await client.query<{ id: number }>(
        `INSERT INTO clientes
          (nome, cpf, email, telefone)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [cliente.nome, cliente.cpf, cliente.email, cliente.telefone]
      )

      clienteIdByCpf.set(cliente.cpf, rows[0].id)
    }

    for (const usuario of usuariosSeed) {
      await client.query(
        `INSERT INTO usuario
          (nome, cpf, email, login, senha)
         VALUES ($1, $2, $3, $4, $5)`,
        [usuario.nome, usuario.cpf, usuario.email, usuario.login, usuario.senha]
      )
    }

    for (const emprestimo of emprestimosSeed) {
      const livroId = livroIdByTitulo.get(emprestimo.livroTitulo)
      const clienteId = clienteIdByCpf.get(emprestimo.clienteCpf)

      if (!livroId || !clienteId) {
        throw new Error('Dependencia do emprestimo nao encontrada no seed')
      }

      await client.query(
        `INSERT INTO emprestimos
          (livro_id, cliente_id, data_emprestimo, data_prevista_devolucao, data_devolucao, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          livroId,
          clienteId,
          emprestimo.dataEmprestimo,
          emprestimo.dataPrevistaDevolucao,
          emprestimo.dataDevolucao,
          emprestimo.status
        ]
      )
    }

    await client.query('COMMIT')

    console.log('Seed concluido com sucesso!')
    console.log(`Autores inseridos: ${String(autoresSeed.length)}`)
    console.log(`Livros inseridos: ${String(livrosSeed.length)}`)
    console.log(`Clientes inseridos: ${String(clientesSeed.length)}`)
    console.log(`Usuarios inseridos: ${String(usuariosSeed.length)}`)
    console.log(`Emprestimos inseridos: ${String(emprestimosSeed.length)}`)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

seed()
  .then(async () => {
    await pool.end()
    process.exit(0)
  })
  .catch(async (error: unknown) => {
    console.error('Falha ao executar seed:', error)
    await pool.end()
    process.exit(1)
  })
