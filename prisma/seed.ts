import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL!, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

const CATEGORIES = [
  { name: "Cidade",    slug: "cidade",    color: "#0a7a6b", order: 1 },
  { name: "Política",  slug: "politica",  color: "#c0392b", order: 2 },
  { name: "Economia",  slug: "economia",  color: "#d35400", order: 3 },
  { name: "Turismo",   slug: "turismo",   color: "#1a6b5a", order: 4 },
  { name: "Cultura",   slug: "cultura",   color: "#6c3483", order: 5 },
  { name: "Paraguai",  slug: "paraguai",  color: "#8e6914", order: 6 },
  { name: "Itaipu",    slug: "itaipu",    color: "#2c3e6b", order: 7 },
  { name: "Esporte",   slug: "esporte",   color: "#1a6b3a", order: 8 },
  { name: "Segurança", slug: "seguranca", color: "#7a1f1f", order: 9 },
];

const ARTIGOS = [
  { title: "Prefeitura anuncia pacote de R$ 12 mi para revitalizar 14 quadras do Centro", slug: "prefeitura-revitalizacao-centro", cat: "cidade", featured: true, lead: "Obras preveem calçamento, arborização e nova iluminação — mas engenheiros ouvidos pela reportagem questionam o cronograma de 8 meses.", readTime: 6, views: 2104 },
  { title: "Câmara aprova novo Plano Diretor com foco em mobilidade urbana", slug: "camara-plano-diretor-mobilidade", cat: "politica", lead: "Votação terminou em 23 a 1 e vai remodelar o uso do solo em áreas de expansão.", readTime: 5, views: 1890 },
  { title: "Governo libera R$ 40 mi para duplicação da PR-495 no trecho de Foz", slug: "duplicacao-pr-495", cat: "economia", lead: "Obra vai reduzir em 40% o tempo de deslocamento entre Foz e o interior do estado.", readTime: 4, views: 1430 },
  { title: "Programa Foz Segura reduz em 40% os roubos de veículos em 6 meses", slug: "foz-segura-reducao-roubos", cat: "seguranca", readTime: 3, views: 980 },
  { title: "Cataratas batem recorde de visitantes em abril: o que explica o pico", slug: "cataratas-recorde-visitantes-abril", cat: "turismo", lead: "Mais de 350 mil turistas passaram pelo parque em 30 dias — novo recorde histórico.", readTime: 5, views: 8200 },
  { title: "Festival das Etnias confirma 15 países e música até meia-noite", slug: "festival-etnias-2026", cat: "cultura", readTime: 4, views: 3400 },
  { title: "O que vale comprar no Paraguai em maio: guia atualizado", slug: "o-que-comprar-paraguai-maio", cat: "paraguai", lead: "Câmbio favorável e nova lista de isenção mudam as regras do duty-free neste mês.", readTime: 7, views: 12400 },
  { title: "40 anos da usina: quem construiu Itaipu e nunca mais saiu de Foz", slug: "40-anos-itaipu-historias", cat: "itaipu", lead: "Série especial com 40 histórias de trabalhadores que fizeram a usina e ficaram para sempre na cidade.", readTime: 22, views: 5600 },
  { title: "Concurso público da prefeitura abre 450 vagas com salários até R$10,3k", slug: "concurso-prefeitura-450-vagas", cat: "cidade", readTime: 3, views: 9800 },
  { title: "Câmbio favorece varejo: fluxo de turistas argentinos sobe 60% em abril", slug: "cambio-turistas-argentinos-varejo", cat: "economia", readTime: 4, views: 4100 },
  { title: "Ponte Amizade: novos horários de pico e o que mudou nas regras de duty-free", slug: "ponte-amizade-horarios-duty-free", cat: "paraguai", readTime: 5, views: 7300 },
  { title: "Puerto Iguazú recebe novo voo low-cost a partir de junho: como reservar", slug: "puerto-iguazu-voo-low-cost", cat: "turismo", readTime: 3, views: 2800 },
  { title: "Itaipu investe R$ 800 mi em energia solar e eólica para 2026", slug: "itaipu-energia-solar-eolica", cat: "itaipu", readTime: 5, views: 3200 },
  { title: "Novo shopping no bairro Três Lagoas previsto para 2027", slug: "shopping-tres-lagoas-2027", cat: "cidade", readTime: 3, views: 1700 },
  { title: "Corrida das 3 Fronteiras confirma 3 mil atletas em junho", slug: "corrida-3-fronteiras-junho", cat: "esporte", readTime: 3, views: 2100 },
  { title: "Obras na Avenida JK causam desvios de trânsito até junho", slug: "obras-avenida-jk-desvios", cat: "cidade", lead: "Trecho entre a Rua Edmundo de Barros e a Jorge Sanways ficará interditado durante o dia.", readTime: 3, views: 1200 },
  { title: "Nova UBS no Morumbi começa atendimento na próxima semana", slug: "nova-ubs-morumbi-atendimento", cat: "cidade", lead: "Unidade vai atender mais de 12 mil moradores dos bairros Morumbi, Três Bandeiras e Jardim América.", readTime: 4, views: 2300 },
  { title: "Transporte coletivo tem nova linha para o São Francisco", slug: "nova-linha-transporte-sao-francisco", cat: "cidade", lead: "Linha 030 vai operar das 5h30 às 23h com intervalos de 20 minutos nos horários de pico.", readTime: 3, views: 870 },
  { title: "Licitação para reforma do Mercadão é aberta pela Prefeitura", slug: "licitacao-reforma-mercadao", cat: "cidade", lead: "Obra orçada em R$ 4,8 milhões vai modernizar a estrutura física e os boxes do mercado municipal.", readTime: 4, views: 1560 },
  { title: "Parque Linear do Rio M'Boicy recebe nova iluminação em LED", slug: "parque-linear-mboicy-iluminacao-led", cat: "cidade", lead: "Instalação de 140 postes de LED vai ampliar a segurança no percurso de 4 km do parque.", readTime: 3, views: 1040 },
];

async function main() {
  console.log("Iniciando seed...");

  // Upsert author
  const author = await prisma.user.upsert({
    where: { email: "redacao@fozemfoco.com.br" },
    update: {},
    create: {
      email: "redacao@fozemfoco.com.br",
      name: "Redação Foz em Foco",
      role: "editor",
    },
  });

  // Upsert categories
  const catMap: Record<string, string> = {};
  for (const cat of CATEGORIES) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    catMap[cat.slug] = c.id;
  }

  // Upsert articles
  for (let i = 0; i < ARTIGOS.length; i++) {
    const art = ARTIGOS[i];
    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        title: art.title,
        slug: art.slug,
        lead: art.lead ?? null,
        body: `<p>${art.title}</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
        status: "publicado",
        featured: art.featured ?? false,
        views: art.views,
        readTime: art.readTime,
        publishedAt: new Date(Date.now() - i * 3600000 * 6),
        categoryId: catMap[art.cat],
        authorId: author.id,
      },
    });
  }

  console.log(`✓ Seed concluído: ${ARTIGOS.length} artigos, ${CATEGORIES.length} categorias.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
