/**
 * Textos de interface (labels, títulos, placeholders).
 * Mantém cópias fora dos componentes para facilitar revisão e futura i18n.
 */
export const labels = {
  app: {
    title: "ERP Console",
    description: "Sistema ERP com Next.js e Node.js",
    brand: "ERP Console",
  },
  nav: {
    home: "Início",
    suppliers: "Fornecedores",
    products: "Produtos",
    employees: "Colaboradores",
    financial: "Financeiro",
    services: "Serviços",
    logout: "Sair",
  },
  common: {
    name: "Nome",
    email: "E-mail",
    password: "Senha",
    loading: "Carregando…",
    delete: "Excluir",
    add: "Adicionar",
    registerAction: "Registrar",
    list: "Lista",
    emDash: "—",
    document: "Documento",
    phone: "Telefone",
    contact: "Contato",
    contactSeparator: " · ",
    description: "Descrição",
    price: "Preço",
    stock: "Estoque",
    sku: "SKU",
    supplier: "Fornecedor",
    noneSupplier: "Nenhum",
    role: "Cargo",
    department: "Departamento",
    type: "Tipo",
    value: "Valor",
    category: "Categoria",
    date: "Data",
    duration: "Duração",
    durationMinutesField: "Duração (min)",
    minutesSuffix: "min",
  },
  auth: {
    registerTitle: "Criar conta",
    registerSubtitle: "Preencha os dados para cadastrar um novo usuário.",
    loginTitle: "Entrar no ERP",
    loginSubtitle: "Use seu e-mail e senha para acessar o sistema.",
    placeholderName: "Nome completo",
    placeholderEmail: "voce@empresa.com",
    placeholderPasswordMin: "Mínimo 6 caracteres",
    placeholderPasswordMask: "••••••••",
    creating: "Criando…",
    registerSubmit: "Cadastrar",
    loggingIn: "Entrando…",
    loginSubmit: "Entrar",
    hasAccount: "Já tenho conta",
    createUser: "Criar usuário",
  },
  dashboard: {
    welcomeTitle: "Bem-vindo ao ERP",
    welcomeLead:
      "Use o menu lateral para acessar fornecedores, produtos, colaboradores, financeiro e serviços. Todas as operações são protegidas por autenticação e persistidas no PostgreSQL.",
  },
  suppliers: {
    pageTitle: "Fornecedores",
    pageSubtitle: "Cadastre e mantenha seus fornecedores.",
    newPanel: "Novo fornecedor",
  },
  products: {
    pageTitle: "Produtos",
    pageSubtitle: "Controle de catálogo e estoque.",
    newPanel: "Novo produto",
  },
  employees: {
    pageTitle: "Colaboradores",
    pageSubtitle: "Cadastro de equipe interna.",
    newPanel: "Novo colaborador",
  },
  financial: {
    pageTitle: "Financeiro",
    pageSubtitle: "Lançamentos de receitas e despesas.",
    newPanel: "Novo lançamento",
    historyPanel: "Histórico",
    income: "Receita",
    expense: "Despesa",
  },
  services: {
    pageTitle: "Serviços",
    pageSubtitle: "Serviços comercializados pela empresa.",
    newPanel: "Novo serviço",
  },
  apiErrors: {
    networkFailure: (apiBase: string) =>
      `Não foi possível conectar à API em ${apiBase}. Inicie o backend (na raiz: npm run dev:api ou npm run dev) e confira NEXT_PUBLIC_API_URL no arquivo .env.local.`,
    invalidJsonResponse: (apiBase: string, status: number) =>
      `A API em ${apiBase} retornou uma resposta que não é JSON (status ${status}). Verifique se a URL aponta para o servidor Node e não para outro serviço.`,
    httpStatus: (status: number) => `Erro ${status}`,
  },
} as const;

export type Labels = typeof labels;
