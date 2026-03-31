export interface BlogPost {
  slug: string;
  title: string;
  shortTitle: string;
  tldr: string;
  image: string;
  category: string;
  readTime: string;
  date: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'hybrid-coaching-ireland',
    title: 'How Personal Trainers in Ireland Can Build a Six-Figure Online Coaching Business Using Hybrid Training Models',
    shortTitle: 'Hybrid Coaching in Ireland',
    tldr: 'Hybrid coaching is the fastest way for personal trainers in Ireland to increase income without adding more hours. It combines in-person PT with online programming, weekly check-ins, nutrition guidance, and accountability systems.',
    image: '/blog/hybrid_coaching.png',
    category: 'Business Growth',
    readTime: '8 min read',
    date: '2026-01-15'
  },
  {
    slug: 'ai-fitness-ireland',
    title: 'AI in Fitness: How Irish Personal Trainers Can Use Tech for Programming, Check-Ins, and Client Retention',
    shortTitle: 'AI in Fitness for Personal Trainers',
    tldr: 'AI and coaching tech help Irish personal trainers save time, improve client delivery, and increase retention. Learn to use AI for onboarding, programming, and admin while keeping coaching human.',
    image: '/blog/ai_in_fitness.png',
    category: 'Technology',
    readTime: '5 min read',
    date: '2026-01-18'
  },
  {
    slug: 'micro-content-fitness-ireland',
    title: 'The Rise of Micro-Content: How Irish Fitness Coaches Can Grow Massive Audiences',
    shortTitle: 'Micro-Content Growth Strategy',
    tldr: 'Micro-content (short, clear videos and posts) is the simplest way for Irish fitness coaches to grow on Instagram Reels, TikTok, and YouTube Shorts.',
    image: '/blog/micro_content_growth.png',
    category: 'Marketing',
    readTime: '7 min read',
    date: '2026-01-22'
  },
  {
    slug: 'high-ticket-fitness-ireland',
    title: 'High-Ticket Fitness Offers in Ireland: What Actually Works in 2026',
    shortTitle: 'High-Ticket Coaching That Sells',
    tldr: 'High-ticket coaching works in Ireland when it\'s based on clear outcomes, premium support, and Irish-friendly, no-pressure sales conversations.',
    image: '/blog/high_ticket_coaching.png',
    category: 'Business Growth',
    readTime: '5 min read',
    date: '2026-01-25'
  },
  {
    slug: 'personal-trainer-branding-ireland',
    title: 'How to Build a Personal Trainer Brand in Ireland That Sells',
    shortTitle: 'Personal Trainer Branding',
    tldr: 'The Irish PT market isn\'t truly saturated—most trainers are generalists with unclear messaging. A strong brand comes from a clear niche and packaged offers.',
    image: '/blog/personal_trainer_branding.png',
    category: 'Marketing',
    readTime: '5 min read',
    date: '2026-01-28'
  },
  {
    slug: 'what-irish-clients-want-2026',
    title: 'What Clients in Ireland Actually Want in 2026 (And What They\'re Sick Of)',
    shortTitle: 'What Irish Clients Want',
    tldr: 'Irish fitness clients in 2026 want consistency, clarity, and accountability—not extreme dieting or confusing plans. The best coaches focus on simple structure.',
    image: '/blog/what_irish_clients_want.png',
    category: 'Client Success',
    readTime: '7 min read',
    date: '2026-02-01'
  },
  {
    slug: 'client-adherence-ireland',
    title: 'The Science of Client Adherence: Behaviour Design & Coaching Psychology for Irish Trainers',
    shortTitle: 'Client Adherence Psychology',
    tldr: 'Client adherence is the real driver of results and retention in Ireland. The best coaches use minimum standards, habit stacking, and weekly check-ins.',
    image: '/blog/client_adherence_psychology.png',
    category: 'Coaching',
    readTime: '5 min read',
    date: '2026-02-05'
  },
  {
    slug: 'digital-products-fitness-ireland',
    title: 'How Irish Trainers Can Monetise Their Expertise With Digital Products',
    shortTitle: 'Digital Products for Trainers',
    tldr: 'Digital products let Irish personal trainers monetise expertise without trading more time for money. Best sellers include programmes, guides, and challenges.',
    image: '/blog/digital_products.png',
    category: 'Business Growth',
    readTime: '5 min read',
    date: '2026-02-08'
  },
  {
    slug: 'nutrition-coaching-ireland',
    title: 'The New Era of Nutrition Coaching in Ireland: What Works in 2026',
    shortTitle: 'Nutrition Coaching Mastery',
    tldr: 'Nutrition coaching is now expected in Ireland. The most effective approach focuses on protein-first habits, calorie awareness, and realistic weekend strategies.',
    image: '/blog/nutrition_coaching.png',
    category: 'Coaching',
    readTime: '6 min read',
    date: '2026-02-10'
  },
  {
    slug: 'social-media-algorithm-ireland',
    title: 'How Irish Trainers Can Win the Algorithm Era and Turn Views Into Clients',
    shortTitle: 'Winning the Algorithm Era',
    tldr: 'Irish trainers can grow on Reels, TikTok, and YouTube Shorts by mastering hooks, watch time, and clarity. Content that wins blends education, proof, and personality.',
    image: '/blog/social_media_algorithm.png',
    category: 'Marketing',
    readTime: '5 min read',
    date: '2026-02-12'
  }
];

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = getBlogBySlug(currentSlug);
  if (!current) return blogPosts.slice(0, limit);
  
  return blogPosts
    .filter(post => post.slug !== currentSlug)
    .sort((a, b) => {
      // Prioritize same category
      const aScore = a.category === current.category ? 1 : 0;
      const bScore = b.category === current.category ? 1 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}
