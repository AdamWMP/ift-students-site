import { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import BlogListContent from '@/components/blog/blog-list-content';

export const metadata: Metadata = {
  title: 'Fitness Industry Blog | Expert Insights for Irish Personal Trainers & Coaches',
  description: 'Expert guides and insights for fitness professionals in Ireland. Hybrid coaching, AI in fitness, PT business marketing, client retention, and career growth strategies from Ireland\'s leading fitness educators.',
  keywords: [
    'fitness blog ireland',
    'personal trainer blog ireland',
    'fitness business tips ireland',
    'hybrid coaching ireland',
    'pt marketing ireland',
    'fitness career advice ireland',
    'image fitness training blog',
  ],
  alternates: { canonical: 'https://imageft.ie/blog' },
  openGraph: {
    title: 'Fitness Industry Blog | Image Fitness Training',
    description: 'Expert insights for fitness professionals in Ireland. Business, coaching, and career growth.',
    url: 'https://imageft.ie/blog',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-charcoal-950">
        <BlogListContent />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
