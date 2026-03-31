import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import WhatsAppButton from '@/components/whatsapp-button';
import { blogPosts, getBlogBySlug, getRelatedPosts, BlogPost } from '@/lib/blog-data';
import BlogArticleContent from './blog-article-content';
import fs from 'fs';
import path from 'path';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found | Image Fitness Training',
    };
  }

  return {
    title: `${post.shortTitle} | Image Fitness Training Blog`,
    description: post.tldr,
    openGraph: {
      title: post.title,
      description: post.tldr,
      images: [post.image],
    },
  };
}

async function getMarkdownContent(slug: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'blog', `${slug}.md`);
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch {
    return '';
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const content = await getMarkdownContent(slug);
  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-charcoal-950">
        <BlogArticleContent post={post} content={content} relatedPosts={relatedPosts} />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
