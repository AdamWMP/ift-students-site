import { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import BlogListContent from '@/components/blog/blog-list-content';

export const metadata: Metadata = {
  title: 'Blog | Image Fitness Training - Fitness Industry Insights for Irish Trainers',
  description: 'Expert insights on building a successful fitness coaching business in Ireland. Learn about hybrid coaching, AI in fitness, marketing strategies, and client retention.',
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
