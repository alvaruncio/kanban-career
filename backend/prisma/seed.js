import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Clean existing data ──
  await prisma.application.deleteMany()
  await prisma.company.deleteMany()
  await prisma.user.deleteMany()

  // ── Users ──
  const hashedPassword = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@kanbancareer.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const alvaro = await prisma.user.create({
    data: {
      name: 'Álvaro García',
      email: 'alvaro@kanbancareer.com',
      password: hashedPassword,
      role: 'USER',
    },
  })

  // ── Companies (Álvaro) ──
  const google = await prisma.company.create({
    data: {
      name: 'Google',
      website: 'https://google.com',
      description: 'Empresa tecnológica multinacional especializada en servicios y productos relacionados con Internet.',
      linkedinUrl: 'https://linkedin.com/company/google',
      userId: alvaro.id,
    },
  })

  const meta = await prisma.company.create({
    data: {
      name: 'Meta',
      website: 'https://meta.com',
      description: 'Empresa tecnológica que desarrolla productos para conectar a las personas.',
      linkedinUrl: 'https://linkedin.com/company/meta',
      userId: alvaro.id,
    },
  })

  const stripe = await prisma.company.create({
    data: {
      name: 'Stripe',
      website: 'https://stripe.com',
      description: 'Plataforma de infraestructura de pagos para empresas de Internet.',
      linkedinUrl: 'https://linkedin.com/company/stripe',
      userId: alvaro.id,
    },
  })

  const spotify = await prisma.company.create({
    data: {
      name: 'Spotify',
      website: 'https://spotify.com',
      description: 'Servicio de música en streaming, podcasts y vídeo digital.',
      linkedinUrl: 'https://linkedin.com/company/spotify',
      userId: alvaro.id,
    },
  })

  const github = await prisma.company.create({
    data: {
      name: 'GitHub',
      website: 'https://github.com',
      description: 'Plataforma de desarrollo colaborativo para alojar proyectos utilizando Git.',
      linkedinUrl: 'https://linkedin.com/company/github',
      userId: alvaro.id,
    },
  })

  // ── Applications (Álvaro) ──
  await prisma.application.createMany({
    data: [
      {
        jobTitle: 'Frontend Developer',
        jobDescription: 'Desarrollo de interfaces de usuario con React y TypeScript para productos Google.',
        offerUrl: 'https://careers.google.com/jobs/frontend-dev',
        companyId: google.id,
        userId: alvaro.id,
        status: 'APPLIED',
        applicationDate: new Date('2026-06-01'),
        source: 'LINKEDIN',
        notes: 'Contacto inicial realizado. Pendiente de respuesta.',
      },
      {
        jobTitle: 'Full Stack Developer',
        jobDescription: 'Desarrollo full stack para plataformas sociales de Meta.',
        offerUrl: 'https://metacareers.com/jobs/fullstack',
        companyId: meta.id,
        userId: alvaro.id,
        status: 'INTERVIEW',
        applicationDate: new Date('2026-06-10'),
        source: 'COMPANY_WEBSITE',
        notes: 'Primera entrevista técnica programada para el 20/07.',
      },
      {
        jobTitle: 'Backend Engineer',
        jobDescription: 'Diseño e implementación de APIs para la plataforma de pagos de Stripe.',
        offerUrl: 'https://stripe.com/jobs/backend',
        companyId: stripe.id,
        userId: alvaro.id,
        status: 'OFFER',
        applicationDate: new Date('2026-05-15'),
        source: 'INDEED',
        notes: 'Oferta recibida. Negociando condiciones.',
      },
      {
        jobTitle: 'iOS Developer',
        jobDescription: 'Desarrollo de la aplicación nativa de Spotify para iOS.',
        offerUrl: 'https://spotifyjobs.com/ios-dev',
        companyId: spotify.id,
        userId: alvaro.id,
        status: 'REJECTED',
        applicationDate: new Date('2026-04-20'),
        source: 'INFOJOBS',
        notes: 'Rechazado después de la tercera entrevista.',
      },
      {
        jobTitle: 'DevRel Engineer',
        jobDescription: 'Relaciones con desarrolladores y creación de contenido técnico para la comunidad.',
        offerUrl: 'https://github.com/careers/devrel',
        companyId: github.id,
        userId: alvaro.id,
        status: 'HIRED',
        applicationDate: new Date('2026-03-01'),
        source: 'REFERRAL',
        notes: 'Contratado gracias a una recomendación interna.',
      },
      {
        jobTitle: 'Data Engineer',
        jobDescription: 'Construcción de pipelines de datos a gran escala para Google Cloud.',
        offerUrl: 'https://careers.google.com/jobs/data-engineer',
        companyId: google.id,
        userId: alvaro.id,
        status: 'INTERVIEW',
        applicationDate: new Date('2026-06-20'),
        source: 'LINKEDIN',
        notes: 'Segunda entrevista pendiente.',
      },
      {
        jobTitle: 'Platform Engineer',
        jobDescription: 'Desarrollo de infraestructura interna para servicios de Stripe.',
        offerUrl: 'https://stripe.com/jobs/platform',
        companyId: stripe.id,
        userId: alvaro.id,
        status: 'APPLIED',
        applicationDate: new Date('2026-06-25'),
        source: 'TECNOEMPLEO',
        notes: 'CV enviado. A la espera.',
      },
    ],
  })

  // ── Companies (Admin) ──
  const acme = await prisma.company.create({
    data: {
      name: 'Acme Corp',
      website: 'https://acme.example.com',
      description: 'Empresa de soluciones empresariales innovadoras.',
      userId: admin.id,
    },
  })

  await prisma.application.createMany({
    data: [
      {
        jobTitle: 'CTO',
        jobDescription: 'Dirección tecnológica de la compañía y liderazgo del equipo de ingeniería.',
        offerUrl: 'https://acme.example.com/careers/cto',
        companyId: acme.id,
        userId: admin.id,
        status: 'APPLIED',
        applicationDate: new Date('2026-07-01'),
        source: 'REFERRAL',
      },
    ],
  })

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
