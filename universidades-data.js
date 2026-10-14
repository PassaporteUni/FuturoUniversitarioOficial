/* ==================================================
   BASE DE DADOS DAS UNIVERSIDADES

   Todas as áreas devem usar estas chaves:
   tecnologia
   engenharia
   saude
   humanas
   administracao
   design
================================================== */

const universidadesData = [
    {
        id: "ufrj",

        nome: "Universidade Federal do Rio de Janeiro",

        sigla: "UFRJ",

        logo: "../assets/UFRJ.png",

        tipo: "publica",

        categoria: "federal",

        estado: "Rio de Janeiro",

        uf: "RJ",

        cidades: [
            "Rio de Janeiro",
            "Macaé",
            "Duque de Caxias"
        ],

        modalidade: [
            "presencial"
        ],

        ingresso: [
            "SiSU",
            "ENEM",
            "Processos seletivos específicos"
        ],

        possuiBolsa: true,

        possuiAssistenciaEstudantil: true,

        areas: [
            "tecnologia",
            "engenharia",
            "saude",
            "humanas",
            "administracao",
            "design"
        ],

        cursos: [
            {
                nome: "Ciência da Computação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia de Computação e Informação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia de Controle e Automação",
                area: "engenharia"
            },

            {
                nome: "Engenharia Civil",
                area: "engenharia"
            },

            {
                nome: "Engenharia Mecânica",
                area: "engenharia"
            },

            {
                nome: "Medicina",
                area: "saude"
            },

            {
                nome: "Enfermagem",
                area: "saude"
            },

            {
                nome: "Nutrição",
                area: "saude"
            },

            {
                nome: "Direito",
                area: "humanas"
            },

            {
                nome: "Psicologia",
                area: "humanas"
            },

            {
                nome: "Administração",
                area: "administracao"
            },

            {
                nome: "Comunicação Visual Design",
                area: "design"
            }
        ],

        descricao:
            "Universidade pública federal com cursos em diferentes áreas do conhecimento e unidades no estado do Rio de Janeiro.",

        site:
            "https://www.acessograduacao.ufrj.br/",

        paginaCursos:
            "https://ufrj.br/ensino-e-pesquisa/cursos-de-graduacao/"
    },

    {
        id: "uerj",

        nome: "Universidade do Estado do Rio de Janeiro",

        sigla: "UERJ",

        logo: "../assets/UERJ.png",

        tipo: "publica",

        categoria: "estadual",

        estado: "Rio de Janeiro",

        uf: "RJ",

        cidades: [
            "Rio de Janeiro",
            "Duque de Caxias",
            "Petrópolis",
            "Teresópolis",
            "Nova Friburgo",
            "Resende",
            "São Gonçalo",
            "Cabo Frio",
            "Angra dos Reis"
        ],

        modalidade: [
            "presencial"
        ],

        ingresso: [
            "Vestibular Estadual",
            "ENEM em processos específicos"
        ],

        possuiBolsa: true,

        possuiAssistenciaEstudantil: true,

        areas: [
            "tecnologia",
            "engenharia",
            "saude",
            "humanas",
            "administracao",
            "design"
        ],

        cursos: [
            {
                nome: "Ciência da Computação",
                area: "tecnologia"
            },

            {
                nome: "Análise e Desenvolvimento de Sistemas",
                area: "tecnologia"
            },

            {
                nome: "Engenharia de Produção",
                area: "engenharia"
            },

            {
                nome: "Engenharia de Materiais",
                area: "engenharia"
            },

            {
                nome: "Engenharia de Energias Renováveis",
                area: "engenharia"
            },

            {
                nome: "Medicina",
                area: "saude"
            },

            {
                nome: "Enfermagem",
                area: "saude"
            },

            {
                nome: "Farmácia",
                area: "saude"
            },

            {
                nome: "Direito",
                area: "humanas"
            },

            {
                nome: "Psicologia",
                area: "humanas"
            },

            {
                nome: "Administração",
                area: "administracao"
            },

            {
                nome: "Design",
                area: "design"
            }
        ],

        descricao:
            "Universidade pública estadual com cursos distribuídos por diferentes municípios do Rio de Janeiro.",

        site:
            "https://www.vestibular.uerj.br/",

        paginaCursos:
            "https://www.uerj.br/ensino/cursos-de-graduacao/"
    },

    {
        id: "uff",

        nome: "Universidade Federal Fluminense",

        sigla: "UFF",

        logo: "../assets/UFF.png",

        tipo: "publica",

        categoria: "federal",

        estado: "Rio de Janeiro",

        uf: "RJ",

        cidades: [
            "Niterói",
            "Volta Redonda",
            "Macaé",
            "Rio das Ostras",
            "Nova Friburgo",
            "Campos dos Goytacazes",
            "Santo Antônio de Pádua",
            "Petrópolis",
            "Angra dos Reis"
        ],

        modalidade: [
            "presencial"
        ],

        ingresso: [
            "SiSU",
            "ENEM"
        ],

        possuiBolsa: true,

        possuiAssistenciaEstudantil: true,

        areas: [
            "tecnologia",
            "engenharia",
            "saude",
            "humanas",
            "administracao",
            "design"
        ],

        cursos: [
            {
                nome: "Ciência da Computação",
                area: "tecnologia"
            },

            {
                nome: "Sistemas de Informação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia de Produção",
                area: "engenharia"
            },

            {
                nome: "Engenharia Mecânica",
                area: "engenharia"
            },

            {
                nome: "Medicina",
                area: "saude"
            },

            {
                nome: "Enfermagem",
                area: "saude"
            },

            {
                nome: "Nutrição",
                area: "saude"
            },

            {
                nome: "Direito",
                area: "humanas"
            },

            {
                nome: "Psicologia",
                area: "humanas"
            },

            {
                nome: "Administração",
                area: "administracao"
            },

            {
                nome: "Cinema e Audiovisual",
                area: "design"
            }
        ],

        descricao:
            "Universidade pública federal com sede em Niterói e unidades acadêmicas em diferentes municípios do estado.",

        site:
            "https://portal.coseac.uff.br/graduacao/sisu/",

        paginaCursos:
            "https://www.uff.br/cursos-de-graduacao/"
    },

    {
        id: "ufrrj",

        nome: "Universidade Federal Rural do Rio de Janeiro",

        sigla: "UFRRJ",

        logo: "../assets/UFRRJ.png",

        tipo: "publica",

        categoria: "federal",

        estado: "Rio de Janeiro",

        uf: "RJ",

        cidades: [
            "Seropédica",
            "Nova Iguaçu",
            "Três Rios"
        ],

        modalidade: [
            "presencial",
            "ead"
        ],

        ingresso: [
            "SiSU",
            "ENEM"
        ],

        possuiBolsa: true,

        possuiAssistenciaEstudantil: true,

        areas: [
            "tecnologia",
            "engenharia",
            "saude",
            "humanas",
            "administracao",
            "design"
        ],

        cursos: [
            {
                nome: "Ciência da Computação",
                area: "tecnologia"
            },

            {
                nome: "Sistemas de Informação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia Agrícola e Ambiental",
                area: "engenharia"
            },

            {
                nome: "Engenharia de Alimentos",
                area: "engenharia"
            },

            {
                nome: "Medicina Veterinária",
                area: "saude"
            },

            {
                nome: "Psicologia",
                area: "humanas"
            },

            {
                nome: "Direito",
                area: "humanas"
            },

            {
                nome: "História",
                area: "humanas"
            },

            {
                nome: "Administração",
                area: "administracao"
            },

            {
                nome: "Administração Pública",
                area: "administracao"
            },

            {
                nome: "Belas Artes",
                area: "design"
            }
        ],

        descricao:
            "Universidade pública federal com forte atuação em ciências agrárias, tecnologia, humanas e gestão.",

        site:
            "https://acessoagraduacao.ufrrj.br/",

        paginaCursos:
            "https://sigaa.ufrrj.br/sigaa/public/curso/lista.jsf?aba=p-ensino&nivel=G"
    },

    {
        id: "unirio",

        nome: "Universidade Federal do Estado do Rio de Janeiro",

        sigla: "UNIRIO",

        logo: "../assets/UNIRIO.jpg",

        tipo: "publica",

        categoria: "federal",

        estado: "Rio de Janeiro",

        uf: "RJ",

        cidades: [
            "Rio de Janeiro"
        ],

        modalidade: [
            "presencial"
        ],

        ingresso: [
            "SiSU",
            "ENEM",
            "Teste de habilidade específica em alguns cursos"
        ],

        possuiBolsa: true,

        possuiAssistenciaEstudantil: true,

        areas: [
            "tecnologia",
            "saude",
            "humanas",
            "administracao",
            "design"
        ],

        cursos: [
            {
                nome: "Sistemas de Informação",
                area: "tecnologia"
            },

            {
                nome: "Medicina",
                area: "saude"
            },

            {
                nome: "Enfermagem",
                area: "saude"
            },

            {
                nome: "Nutrição",
                area: "saude"
            },

            {
                nome: "Direito",
                area: "humanas"
            },

            {
                nome: "História",
                area: "humanas"
            },

            {
                nome: "Pedagogia",
                area: "humanas"
            },

            {
                nome: "Administração Pública",
                area: "administracao"
            },

            {
                nome: "Teatro",
                area: "design"
            },

            {
                nome: "Música",
                area: "design"
            }
        ],

        descricao:
            "Universidade pública federal localizada na cidade do Rio de Janeiro, com destaque nas áreas de saúde, humanas, artes e tecnologia.",

        site:
            "https://www.unirio.br/ingresso-1/graduacao",

        paginaCursos:
            "https://www.unirio.br/cursos-1/graduacao"
    },

    {
        rotuloCategoria: "Centro Federal",

        id: "cefet-rj",

        nome: "Centro Federal de Educação Tecnológica Celso Suckow da Fonseca",

        sigla: "CEFET/RJ",

        logo: "../assets/CEFET.png",

        tipo: "publica",

        categoria: "federal",

        estado: "Rio de Janeiro",

        uf: "RJ",

        cidades: [
            "Rio de Janeiro",
            "Nova Iguaçu",
            "Petrópolis",
            "Angra dos Reis",
            "Itaguaí",
            "Nova Friburgo",
            "Valença"
        ],

        modalidade: [
            "presencial",
            "ead"
        ],

        ingresso: [
            "SiSU",
            "ENEM",
            "Processo seletivo para cursos técnicos"
        ],

        possuiBolsa: true,

        possuiAssistenciaEstudantil: true,

        areas: [
            "tecnologia",
            "engenharia",
            "humanas",
            "administracao"
        ],

        cursos: [
            {
                nome: "Ciência da Computação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia de Computação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia de Controle e Automação",
                area: "engenharia"
            },

            {
                nome: "Engenharia Elétrica",
                area: "engenharia"
            },

            {
                nome: "Engenharia Mecânica",
                area: "engenharia"
            },

            {
                nome: "Engenharia Civil",
                area: "engenharia"
            },

            {
                nome: "Administração",
                area: "administracao"
            },

            {
                nome: "Línguas Estrangeiras Aplicadas",
                area: "humanas"
            }
        ],

        descricao:
            "Instituição pública federal especializada em educação tecnológica, oferecendo cursos técnicos e de graduação.",

        site:
            "https://www.cefet-rj.br/index.php/alunos-graduacao/10049-processo-seletivo-para-os-cursos-de-graduacao-edicao-unica-do-sisu-2026-para-preenchimento-das-vagas-de-2026-1-e-2026-2",

        paginaCursos:
            "https://www.cefet-rj.br/graduacao"
    },

    {
        id: "ifrj",

        rotuloCategoria: "Instituto Federal",

        nome: "Instituto Federal de Educação, Ciência e Tecnologia do Rio de Janeiro",

        sigla: "IFRJ",

        logo: "../assets/IFRJ.jpg",

        tipo: "publica",

        categoria: "federal",

        estado: "Rio de Janeiro",

        uf: "RJ",

        cidades: [
            "Rio de Janeiro",
            "Nilópolis",
            "Duque de Caxias",
            "Paracambi",
            "Niterói",
            "São Gonçalo",
            "São João de Meriti",
            "Belford Roxo",
            "Mesquita",
            "Arraial do Cabo",
            "Engenheiro Paulo de Frontin",
            "Pinheiral",
            "Resende",
            "Volta Redonda"
        ],

        modalidade: [
            "presencial",
            "ead"
        ],

        ingresso: [
            "SiSU",
            "ENEM",
            "Processos seletivos próprios"
        ],

        possuiBolsa: true,

        possuiAssistenciaEstudantil: true,

        areas: [
            "tecnologia",
            "engenharia",
            "saude",
            "humanas",
            "administracao",
            "design"
        ],

        cursos: [
            {
                nome: "Jogos Digitais",
                area: "tecnologia"
            },

            {
                nome: "Redes de Computadores",
                area: "tecnologia"
            },

            {
                nome: "Licenciatura em Computação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia Química",
                area: "engenharia"
            },

            {
                nome: "Farmácia",
                area: "saude"
            },

            {
                nome: "Fisioterapia",
                area: "saude"
            },

            {
                nome: "Ciências Biológicas",
                area: "saude"
            },

            {
                nome: "Produção Cultural",
                area: "humanas"
            },

            {
                nome: "Gestão Ambiental",
                area: "administracao"
            },

            {
                nome: "Design Gráfico",
                area: "design"
            }
        ],

        descricao:
            "Instituição pública federal que oferece formação técnica, tecnológica e superior em diferentes municípios do estado.",

        site:
            "https://www.ifrj.edu.br/processo-seletivo-graduacao/sisu",

        paginaCursos:
            "https://www.ifrj.edu.br/cursos-graduacao"
    },

    {
        id: "puc-rio",

        nome: "Pontifícia Universidade Católica do Rio de Janeiro",

        sigla: "PUC-Rio",

        logo: "../assets/PUC.png",

        tipo: "privada",

        categoria: "comunitaria",

        estado: "Rio de Janeiro",

        uf: "RJ",

        cidades: [
            "Rio de Janeiro"
        ],

        modalidade: [
            "presencial"
        ],

        ingresso: [
            "Vestibular",
            "ENEM",
            "Processos seletivos específicos"
        ],

        possuiBolsa: true,

        possuiAssistenciaEstudantil: false,

        areas: [
            "tecnologia",
            "engenharia",
            "saude",
            "humanas",
            "administracao",
            "design"
        ],

        cursos: [
            {
                nome: "Ciência da Computação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia de Computação",
                area: "tecnologia"
            },

            {
                nome: "Engenharia de Controle e Automação",
                area: "engenharia"
            },

            {
                nome: "Engenharia Civil",
                area: "engenharia"
            },

            {
                nome: "Farmácia",
                area: "saude"
            },

            {
                nome: "Psicologia",
                area: "humanas"
            },

            {
                nome: "Direito",
                area: "humanas"
            },

            {
                nome: "Administração",
                area: "administracao"
            },

            {
                nome: "Design",
                area: "design"
            },

            {
                nome: "Comunicação Social",
                area: "design"
            }
        ],

        descricao:
            "Universidade privada comunitária localizada no Rio de Janeiro, com cursos em tecnologia, engenharias, humanas, gestão, saúde e design.",

        site:
            "https://www.puc-rio.br/vestibular/",

        paginaCursos:
            "https://www.puc-rio.br/vestibular/202612/cursos.html"
    }
];

window.universidadesData =
    universidadesData;