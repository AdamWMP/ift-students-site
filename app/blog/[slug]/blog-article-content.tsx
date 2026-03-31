'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowLeft, ArrowRight, Share2, BookOpen, ChevronUp } from 'lucide-react';
import { BlogPost } from '@/lib/blog-data';

interface BlogArticleContentProps {
  post: BlogPost;
  content: string;
  relatedPosts: BlogPost[];
}

export default function BlogArticleContent({ post, content, relatedPosts }: BlogArticleContentProps) {
  const [isClient, setIsClient] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    setIsClient(true);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadProgress(progress);
      setShowScrollTop(scrollTop > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.tldr,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Parse markdown content into sections
  const sections = content.split('\n\n').filter(p => p.trim());

  if (!isClient) {
    return <div className="min-h-screen bg-charcoal-950" />;
  }

  return (
    <div className="relative">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-charcoal-800 z-50">
        <motion.div
          className="h-full bg-gold"
          style={{ width: `${readProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/80 via-charcoal-950/90 to-charcoal-950" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            {/* Back Link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Blog</span>
            </Link>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-gold/20 text-gold px-4 py-1.5 rounded-full text-sm font-medium border border-gold/30">
                {post.category}
              </span>
              <span className="text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <span className="text-gray-500 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                {sections.length} sections
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* TLDR */}
            <div className="bg-charcoal-900/50 backdrop-blur-sm border border-charcoal-800 rounded-2xl p-6 mb-8">
              <p className="text-gold font-medium mb-2">TL;DR</p>
              <p className="text-gray-300 text-lg leading-relaxed">{post.tldr}</p>
            </div>

            {/* Share Button */}
            <button
              onClick={shareArticle}
              className="inline-flex items-center gap-2 bg-charcoal-800 hover:bg-charcoal-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Article</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.article
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="prose-custom"
            >
              {sections.map((section, index) => {
                const isHeader = section.startsWith('## ');
                const isSubHeader = section.startsWith('### ');
                const isList = section.startsWith('- ') || section.startsWith('• ');
                const isEmphasis = section.includes('**') || section.length < 50;

                if (isHeader) {
                  return (
                    <motion.h2
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      className="text-3xl md:text-4xl font-bold text-white mt-16 mb-6 first:mt-0"
                    >
                      {section.replace('## ', '')}
                    </motion.h2>
                  );
                }

                if (isSubHeader) {
                  return (
                    <motion.h3
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      className="text-2xl font-bold text-gold mt-10 mb-4"
                    >
                      {section.replace('### ', '')}
                    </motion.h3>
                  );
                }

                if (isList) {
                  const items = section.split('\n').filter(item => item.trim());
                  return (
                    <motion.ul
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      className="space-y-3 my-6"
                    >
                      {items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-300">
                          <span className="w-1.5 h-1.5 bg-gold rounded-full mt-2.5 flex-shrink-0" />
                          <span>{item.replace(/^[-•]\s*/, '')}</span>
                        </li>
                      ))}
                    </motion.ul>
                  );
                }

                if (isEmphasis && !section.includes('.')) {
                  return (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: '-100px' }}
                      className="text-xl text-gold font-medium my-8"
                    >
                      {section}
                    </motion.p>
                  );
                }

                return (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    className="text-gray-300 text-lg leading-relaxed my-6"
                  >
                    {section}
                  </motion.p>
                );
              })}
            </motion.article>

            {/* CTA Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 p-8 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-3xl text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Start Your Fitness Career?
              </h3>
              <p className="text-gray-400 mb-6">
                Join Image Fitness Training and become a certified personal trainer in Ireland.
              </p>
              <Link
                href="/courses/personal-trainer"
                className="inline-flex items-center gap-2 bg-gold hover:bg-gold-400 text-charcoal-950 px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
              >
                Explore Our Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-20 border-t border-charcoal-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Related <span className="text-gold">Articles</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {relatedPosts.map((relatedPost, index) => (
              <motion.div
                key={relatedPost.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/blog/${relatedPost.slug}`}>
                  <div className="group rounded-2xl overflow-hidden bg-charcoal-900 border border-charcoal-800 hover:border-gold/50 transition-all duration-500">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={relatedPost.image}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 to-transparent" />
                    </div>
                    <div className="p-5">
                      <span className="text-gold text-xs font-medium">{relatedPost.category}</span>
                      <h3 className="text-lg font-bold text-white mt-2 group-hover:text-gold transition-colors line-clamp-2">
                        {relatedPost.shortTitle}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: showScrollTop ? 1 : 0, scale: showScrollTop ? 1 : 0.8 }}
        onClick={scrollToTop}
        className="fixed bottom-24 right-6 w-12 h-12 bg-gold text-charcoal-950 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
