'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { blogPosts, BlogPost } from '@/lib/blog-data';

const categories = ['All', 'Business Growth', 'Marketing', 'Coaching', 'Technology', 'Client Success'];

export default function BlogListContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isClient, setIsClient] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = blogPosts[0];
  const regularPosts = activeCategory === 'All' ? blogPosts.slice(1) : filteredPosts;

  if (!isClient) {
    return <div className="min-h-screen bg-charcoal-950" />;
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/5 rounded-full blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-gold" />
              <span className="text-gold text-sm font-medium">Industry Insights</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              The Fitness{' '}
              <span className="text-gold">Academy</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Expert strategies for Irish personal trainers looking to build profitable coaching businesses, 
              master marketing, and deliver exceptional client results.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-y border-charcoal-800 bg-charcoal-950/50 backdrop-blur-sm sticky top-20 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-gold text-charcoal-950'
                    : 'bg-charcoal-800 text-gray-400 hover:bg-charcoal-700 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post - Only show when 'All' is selected */}
      {activeCategory === 'All' && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href={`/blog/${featuredPost.slug}`}>
                <div 
                  className="group relative rounded-3xl overflow-hidden bg-charcoal-900 border border-charcoal-800 hover:border-gold/50 transition-all duration-500"
                  onMouseEnter={() => setHoveredCard('featured')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Image */}
                    <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full overflow-hidden">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/50 to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-gold text-charcoal-950 px-4 py-1.5 rounded-full text-sm font-bold">
                          Featured
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-gold text-sm font-medium">{featuredPost.category}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {featuredPost.readTime}
                        </span>
                      </div>

                      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 group-hover:text-gold transition-colors duration-300">
                        {featuredPost.title}
                      </h2>

                      <p className="text-gray-400 text-lg mb-6 line-clamp-3">
                        {featuredPost.tldr}
                      </p>

                      <div className="flex items-center gap-2 text-gold font-medium">
                        <span>Read Article</span>
                        <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${hoveredCard === 'featured' ? 'translate-x-2' : ''}`} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {regularPosts.map((post, index) => (
                <BlogCard 
                  key={post.slug} 
                  post={post} 
                  index={index}
                  isHovered={hoveredCard === post.slug}
                  onHover={(hovered) => setHoveredCard(hovered ? post.slug : null)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-transparent to-gold/10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your <span className="text-gold">Fitness Career</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join Ireland&apos;s leading fitness education provider and transform your passion into a profession.
            </p>
            <Link
              href="/courses/personal-trainer"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-400 text-charcoal-950 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              View Our Courses
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function BlogCard({ 
  post, 
  index, 
  isHovered, 
  onHover 
}: { 
  post: BlogPost; 
  index: number;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div
          className="group relative h-full rounded-2xl overflow-hidden bg-charcoal-900 border border-charcoal-800 hover:border-gold/50 transition-all duration-500"
          onMouseEnter={() => onHover(true)}
          onMouseLeave={() => onHover(false)}
        >
          {/* Image */}
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-charcoal-950/80 backdrop-blur-sm text-gold px-3 py-1 rounded-full text-xs font-medium border border-gold/30">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gold transition-colors duration-300">
              {post.shortTitle}
            </h3>

            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
              {post.tldr}
            </p>

            <div className="flex items-center gap-2 text-gold text-sm font-medium">
              <span>Read More</span>
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-2' : ''}`} />
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
