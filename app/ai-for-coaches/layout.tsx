import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI for Fitness Coaches | Ireland\'s First Workshop | Image Fitness Training',
  description:
    'A practical online workshop for Irish fitness coaches. Build your own AI setup, create a week of content in 30 minutes, and transform how you run your business. 20 places only — May 2026.',
  openGraph: {
    title: 'AI for Fitness Coaches | Ireland\'s First Workshop',
    description: 'Two evenings. Your own AI setup. 20 places only. Fully online. May 2026.',
    images: ['/og-image.png'],
  },
};

export default function AIForCoachesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
