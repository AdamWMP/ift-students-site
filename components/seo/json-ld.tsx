// JSON-LD Structured Data components for rich Google results and LLM citations
// Drop any of these into a page's server component (no 'use client' needed)

// ── LocalBusiness — goes in root layout or homepage ──────────────────────────
export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Image Fitness Training',
    alternateName: ['ImageFT', 'IFT', 'Image Fitness Training Global'],
    url: 'https://imageft.ie',
    logo: 'https://imageft.ie/logo-global.png',
    // Phase 13 (2026-05-27): updated to canonical share image (per Phase 2
    // standardisation). Was /og-image.png which was migrated to /logo-dark.jpg.
    image: 'https://imageft.ie/logo-dark.jpg',
    description: "Ireland's #1 fitness educator. REPs Ireland accredited Personal Trainer, Pilates, Strength & Conditioning, Nutrition and Pre & Post Natal courses. 15+ years experience, 5,000+ graduates.",
    foundingDate: '2008',
    telephone: '+353-1-902-3377',
    email: 'hello@imageft.ie',
    sameAs: [
      'https://www.facebook.com/imagefitnesstrainingLTD',
      'https://www.instagram.com/imagefitnesstrainingofficial',
      'https://imagepilates.ie',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IE',
      addressRegion: 'Dublin',
    },
    // Phase 13 (2026-05-27): real operational locations. Was claiming Belfast
    // (never operational); was missing Swords, Tallaght, Tuam, Derry. Per Phase
    // 22 verification gate — all cities below appear on the live /locations page.
    areaServed: [
      { '@type': 'City', name: 'Swords' },
      { '@type': 'City', name: 'Tallaght' },
      { '@type': 'City', name: 'Dublin' },
      { '@type': 'City', name: 'Cork' },
      { '@type': 'City', name: 'Galway' },
      { '@type': 'City', name: 'Tuam' },
      { '@type': 'City', name: 'Limerick' },
      { '@type': 'City', name: 'Wexford' },
      { '@type': 'City', name: 'Derry' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Fitness Certification Courses',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Personal Trainer Course', url: 'https://imageft.ie/courses/personal-trainer' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Mat & Reformer Pilates Course', url: 'https://imagepilates.ie' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Strength & Conditioning Course', url: 'https://imageft.ie/courses/strength-conditioning' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'NutriCert Global Nutrition Course', url: 'https://imageft.ie/courses/nutricert' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Pre & Post Natal Exercise Course', url: 'https://imageft.ie/courses/pre-post-natal' } },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
      bestRating: '5',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── Course schema — add to each course page ───────────────────────────────────
interface CourseSchemaProps {
  name: string
  description: string
  url: string
  price?: string
  currency?: string
  duration?: string
  educationalLevel?: string
  provider?: string
}

export function CourseJsonLd({
  name,
  description,
  url,
  price,
  currency = 'EUR',
  duration,
  educationalLevel,
}: CourseSchemaProps) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    url,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Image Fitness Training',
      url: 'https://imageft.ie',
      sameAs: 'https://imageft.ie',
    },
    inLanguage: 'en-IE',
    availableLanguage: 'English',
    courseMode: ['blended', 'onsite'],
    locationCreated: {
      '@type': 'Country',
      name: 'Ireland',
    },
  }

  if (educationalLevel) schema.educationalLevel = educationalLevel
  if (duration) schema.timeRequired = duration

  if (price) {
    schema.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString().split('T')[0],
      url,
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── FAQ schema — add to pages with FAQ sections ───────────────────────────────
interface FAQItem {
  question: string
  answer: string
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

// ── BreadcrumbList — add to course/inner pages ────────────────────────────────
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
