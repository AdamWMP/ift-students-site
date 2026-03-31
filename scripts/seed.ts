import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clear existing data
  await prisma.booking.deleteMany()
  await prisma.startDate.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.location.deleteMany()
  await prisma.package.deleteMany()
  await prisma.tutor.deleteMany()
  await prisma.testimonial.deleteMany()

  // Create Locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Swords',
        slug: 'swords',
        region: 'Dublin',
        address: 'The Castle Shopping Centre, Bridge Street, Swords, Co. Dublin',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Tallaght',
        slug: 'tallaght',
        region: 'Dublin',
        address: 'The Vault Health Club, Belgard Square W, Tallaght, Dublin 24',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Cork',
        slug: 'cork',
        region: 'Cork',
        address: 'FLYEfit Cork, Stapleton House, 10 Oliver Plunkett St, Centre, Cork',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Galway',
        slug: 'galway',
        region: 'Galway',
        address: 'HQ Gym, N17 Business Park, Galway Rd, Farrannamartin, Tuam, Co. Galway',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Limerick',
        slug: 'limerick',
        region: 'Limerick',
        address: 'Matchbox Fitness, Unit 6E Eastpoint Retail Park, Ballysimon Rd, Limerick',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Wexford',
        slug: 'wexford',
        region: 'Wexford',
        address: 'Predator Fitness, Unit 4, Kerlogue Industrial Estate, Co. Wexford',
      },
    }),
    prisma.location.create({
      data: {
        name: 'Online',
        slug: 'online',
        region: 'Online',
        address: 'Learn from anywhere with our online program',
      },
    }),
  ])

  console.log(`Created ${locations.length} locations`)

  // Create Schedules for each location
  const dublinLocations = locations.filter((l) => l.region === 'Dublin')
  const otherLocations = locations.filter((l) => l.region !== 'Dublin' && l.slug !== 'online')
  const onlineLocation = locations.find((l) => l.slug === 'online')

  const schedules: any[] = []

  // Dublin schedules
  for (const loc of dublinLocations) {
    const eveningSchedule = await prisma.schedule.create({
      data: {
        name: 'Evenings + Saturdays',
        slug: `evening-weekend-${loc.slug}`,
        description: 'Perfect for working professionals',
        duration: '8 weeks',
        icon: '🌙',
        times: 'Mon & Wed 7-10pm + Sat 10am-4:30pm',
        locationId: loc.id,
      },
    })
    const fullTimeSchedule = await prisma.schedule.create({
      data: {
        name: 'Full-Time',
        slug: `full-time-${loc.slug}`,
        description: 'Intensive daytime program',
        duration: '8 weeks',
        icon: '☀️',
        times: 'Thu & Fri 10am-4:30pm',
        locationId: loc.id,
      },
    })
    schedules.push(eveningSchedule, fullTimeSchedule)
  }

  // Other locations schedules
  for (const loc of otherLocations) {
    const saturdaySchedule = await prisma.schedule.create({
      data: {
        name: 'Saturday Only',
        slug: `saturday-only-${loc.slug}`,
        description: 'Weekend learning, flexible schedule',
        duration: '16 weeks',
        icon: '📅',
        times: 'Every Saturday 10am-4:30pm',
        locationId: loc.id,
      },
    })
    const fullTimeOther = await prisma.schedule.create({
      data: {
        name: 'Full-Time Intensive',
        slug: `full-time-${loc.slug}`,
        description: '8-week intensive program',
        duration: '8 weeks',
        icon: '☀️',
        times: 'Thu & Fri 10am-4:30pm',
        locationId: loc.id,
      },
    })
    schedules.push(saturdaySchedule, fullTimeOther)
  }

  // Online schedule
  if (onlineLocation) {
    const onlineSchedule = await prisma.schedule.create({
      data: {
        name: 'Self-Paced Online',
        slug: 'online-self-paced',
        description: 'Learn at your own pace from anywhere',
        duration: '12-16 weeks',
        icon: '🌐',
        times: 'Flexible schedule with live sessions',
        locationId: onlineLocation.id,
      },
    })
    schedules.push(onlineSchedule)
  }

  console.log(`Created ${schedules.length} schedules`)

  // Create Start Dates
  const startDatesData = [
    { date: new Date('2026-03-02'), spotsLeft: 8 },
    { date: new Date('2026-04-27'), spotsLeft: 12 },
    { date: new Date('2026-05-15'), spotsLeft: 10 },
    { date: new Date('2026-07-02'), spotsLeft: 15 },
    { date: new Date('2026-09-01'), spotsLeft: 12 },
  ]

  for (const schedule of schedules) {
    for (const sd of startDatesData) {
      await prisma.startDate.create({
        data: {
          date: sd.date,
          spotsLeft: sd.spotsLeft,
          scheduleId: schedule.id,
        },
      })
    }
  }

  console.log('Created start dates')

  // Create Packages
  const packages = await Promise.all([
    prisma.package.create({
      data: {
        name: 'Pro Coach',
        slug: 'pro-coach',
        price: 2600,
        fundedPrice: 1350,
        description: 'Essential PT certification package',
        features: [
          'Fitness Instructor (EQF L3)',
          'Personal Trainer (EQF L4)',
          'Nutrition Diploma (NutriCert 1.0)',
          'Free workshops & events',
          'REPs registration support',
        ],
        popular: false,
      },
    }),
    prisma.package.create({
      data: {
        name: 'Complete Coach',
        slug: 'complete-coach',
        price: 3200,
        fundedPrice: 2100,
        description: 'Full certification plus business mentorship',
        features: [
          'Fitness Instructor (EQF L3)',
          'Personal Trainer (EQF L4)',
          'Nutrition Diploma (NutriCert 1.0)',
          'Fitness Business Accelerator',
          '90-day mentorship program',
          'Get your first paying clients',
        ],
        popular: true,
      },
    }),
    prisma.package.create({
      data: {
        name: 'Elite Coach',
        slug: 'elite-coach',
        price: 4000,
        fundedPrice: 2700,
        description: 'Premium package with extended support',
        features: [
          'Everything in Complete Coach',
          'S&C Foundation Module',
          '6-month extended mentorship',
          'Website & branding package',
          'VIP job placement',
          'Lifetime alumni network access',
        ],
        popular: false,
      },
    }),
  ])

  console.log(`Created ${packages.length} packages`)

  // Create Tutors
  const tutors = await Promise.all([
    prisma.tutor.create({ data: { name: 'Tomás', role: 'Lead Tutor', location: 'Cork', bio: 'Industry veteran with 10+ years experience in PT and group fitness instruction.', order: 1 } }),
    prisma.tutor.create({ data: { name: 'Shane', role: 'Senior Tutor', location: 'Cork', bio: 'Specialist in strength training and functional fitness programming.', order: 2 } }),
    prisma.tutor.create({ data: { name: 'Eoin', role: 'Tutor', location: 'Cork', bio: 'Expert in sports performance and athletic development.', order: 3 } }),
    prisma.tutor.create({ data: { name: 'Greg', role: 'Tutor', location: 'Cork', bio: 'Focuses on client transformation and sustainable fitness habits.', order: 4 } }),
    prisma.tutor.create({ data: { name: 'Aisling', role: 'Tutor', location: 'Cork', bio: 'Specialist in nutrition coaching and lifestyle transformation.', order: 5 } }),
    prisma.tutor.create({ data: { name: 'Holly', role: 'Tutor', location: 'Cork', bio: 'Expert in group fitness and high-energy training sessions.', order: 6 } }),
    prisma.tutor.create({ data: { name: 'May', role: 'Tutor', location: 'Cork', bio: 'Passionate about helping new trainers build confidence.', order: 7 } }),
    prisma.tutor.create({ data: { name: 'Pilar', role: 'Lead Pilates Tutor', location: 'Dublin', bio: 'Master Pilates instructor with a track record of producing successful graduates.', order: 8 } }),
    prisma.tutor.create({ data: { name: 'Edel', role: 'Pilates Tutor', location: 'Dublin', bio: 'Specializes in rehabilitation and pre/post-natal Pilates.', order: 9 } }),
    prisma.tutor.create({ data: { name: 'Michael', role: 'Senior Tutor', location: 'Dublin', bio: 'Expert in business development for fitness professionals.', order: 10 } }),
  ])

  console.log(`Created ${tutors.length} tutors`)

  // Create Testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({ data: { name: 'Nikki Hanlon', course: 'Pilates Graduate', content: 'I cannot recommend Pilar enough. Her mentorship helped me start my own fully-booked Pilates business.', rating: 5, order: 1 } }),
    prisma.testimonial.create({ data: { name: 'Sarah Murphy', course: 'PT Graduate, Cork', content: 'From leg press dropsets to Tabata at 9am, the Cork tutors made it an unforgettable 8 weeks. Best decision ever!', rating: 5, order: 2 } }),
    prisma.testimonial.create({ data: { name: 'Paula Spillane', course: 'PT Graduate, Midleton', content: 'The 8-week intensive was incredible. May & Tomás were professional and supportive throughout.', rating: 5, order: 3 } }),
    prisma.testimonial.create({ data: { name: 'Leah Barry', course: 'Pilates Graduate', content: 'Set me up with all the tools to teach immediately. Instructor Tomás was brilliant—highly recommend!', rating: 5, order: 4 } }),
  ])

  console.log(`Created ${testimonials.length} testimonials`)

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
