'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { MapPin, Award, Users, X, Quote } from 'lucide-react'

const tutors = [
  // — Leadership —
  {
    name: 'Aaron Buckley',
    role: 'CEO',
    location: 'Dublin',
    shortBio: 'Leading Image Fitness Training with a vision to develop the next generation of fitness professionals.',
    fullBio: '',
    image: '/tutors/aaron.png'
  },
  {
    name: 'Simon Creedon',
    role: 'Co-Founder',
    location: 'Dublin',
    shortBio: 'Former professional athlete, specialist in Olympic lifting.',
    fullBio: '',
    image: '/tutors/simon.png'
  },
  {
    name: 'Conor Whyte',
    role: 'Co-Founder',
    location: 'Limerick',
    shortBio: 'Passionate about community fitness and group training.',
    fullBio: '',
    image: '/tutors/conor.png'
  },
  // — Head / Lead Tutors —
  {
    name: 'Johnny Broughton',
    role: 'Head Tutor',
    location: 'Nationwide',
    shortBio: 'Head Tutor at Image Fitness Training, leading the delivery of Ireland\'s top personal trainer qualification with years of hands-on coaching experience.',
    fullBio: `As Head Tutor at Image Fitness Training, Johnny brings a wealth of experience coaching and developing fitness professionals across Ireland. With a career built on practical gym-floor expertise and a passion for education, Johnny leads the tutor team with a hands-on, student-first approach.

Johnny is committed to ensuring every student who comes through the doors of IFT leaves not just qualified, but genuinely ready to coach — confident in the science, the practical, and the business of personal training.

His infectious energy and real-world coaching style make him one of the most sought-after tutors in the country. Whether you're on the gym floor, in the classroom, or working through your practical exams, Johnny is there to make sure you hit your stride.`,
    image: '/tutors/johnny.png'
  },
  {
    name: 'Shane Roche',
    role: 'Lead Tutor & Neuromuscular Therapist',
    location: 'Nationwide',
    shortBio: 'Lead Tutor with over 15 years of experience in fitness, rehabilitation, and sports performance.',
    fullBio: `Shane Roche is a Lead Tutor at Image Fitness Training and a qualified Neuromuscular Physical Therapist, with over 15 years of experience in fitness, rehabilitation, and sports performance. He also holds qualifications in Cognitive Behavioural Therapy (CBT), Physio First Aid, and Strength & Conditioning, and has coached local GAA, football, and rugby teams.

Shane specialises in rehabilitation, corrective exercise, strength training, and group fitness classes, with a strong focus on helping clients return to sport safely and confidently. He got his start in the industry through CrossFit, and over the years, his passion has shifted toward injury prevention, confidence in movement, and long-term client success.

When it comes to learning, students can expect a fun, easygoing environment full of laughter, less stress, and plenty of practical, hands-on learning. Shane focuses on preparing students for the real-world fitness industry with a balanced approach that prioritises practical skills and confidence over stress.

On a personal note, he believes that it's better to fail and learn than never try. He encourages students to embrace challenges, knowing that every step forward is progress.`,
    image: '/tutors/shane.png'
  },
  {
    name: 'Pilar Lokko',
    role: 'Lead Pilates & PT Tutor',
    location: 'Dublin',
    shortBio: 'In the industry over 17 years, passionate about helping people improve their lives through movement and nutrition.',
    fullBio: `In the industry over 17 years now, my mission is to help improve the quality of people's lives through movement and nutrition.

I have my own Fitness Community which is a second home for my clients. It's full of amazing and strong women becoming emotionally and physically stronger. I help them to create healthy habits and enhance pre-existing good habits so that they can reap all the benefits associated with exercise and healthy eating/living.

Through Strength and Conditioning sessions, Post-pregnancy sessions for Mamas with babies, Pilates classes, Dance Fitness, Step Aerobics, and online programs, I provide a multi-faceted approach to exercise open to women at any stage in life, adopting a personalised approach rather than a one-fits-all approach.

As a tutor with Image Fitness working on both the Combination Course and the Mat Pilates Course, I believe that real ability isn't just doing it yourself — it's helping others realise that they can too. I am passionate about creating a learning environment that not only delivers the correct information, providing students with the fundamentals needed to complete the course, but also builds confidence, as instructors need to present their authentic self in the fitness industry.

I want the students to feel on their learning journey exactly how I want my clients to feel: safe and capable. I want them to leave their course with belief in their knowledge and competency, to stay grounded and to keep learning and growing — always remembering that client care is number one, and to go out there and be that coach, PT, or instructor that they know their clients are in the right hands with.`,
    image: '/tutors/pilar.png'
  },
  // — Dublin Tutors —
  {
    name: 'Kevin McCarthy',
    role: 'Tutor & Fitness Business Accelerator Mentor',
    location: 'Dublin',
    shortBio: 'Almost 10 years in the industry, former Flyefit Head Coach & Head of Performance, now running ThinkFit Coaching.',
    fullBio: `I've almost 10 years' experience in the fitness industry, working across commercial gyms and now running my own semi-private coaching facility, ThinkFit Coaching, in Rathfarnham. Alongside that, I run a busy online coaching business supporting clients with strength development, fat loss and long-term lifestyle change.

Previously, I worked with Flyefit as both Head Coach and Head of Performance. I recruited and educated personal trainers, built internal education systems, developed class structures and mentored coaching teams across the company. As Head of Performance, I oversaw standards across 21 sites — managing coaching quality, programming systems, new gym installs, layout planning, marketing input, HR involvement and operational systems. If it exists within a fitness business, I've probably had my hands in it.

That experience gave me a full 360° understanding of the industry — from coaching on the gym floor to leadership, systems and scale.

I've worked in education with several academies over the years — and genuinely, Image is the best by far. The standards and the focus on producing capable coaches (not just certified ones) is what sets it apart.

My goal is simple: raise the standard of the PT industry. If we develop better coaches, they can help more people — and that's how real impact happens. I'm big on assessment, critical thinking and coaching the individual in front of you rather than blindly following templates.

Before fitness, I was self-employed for over 10 years running retail businesses. That business background shaped how I coach and mentor trainers today — because being a great PT isn't just about programming. It's about communication, leadership and building something sustainable.

When you learn from me, expect honesty, practical application, high standards and zero fluff.

My motto: Wake up. Work hard. Be kind. Go to bed. Strong coffee and Guinness enthusiast.`,
    image: '/tutors/kevin.jpg'
  },
  {
    name: 'Gary Downey',
    role: 'Tutor',
    location: 'Dublin',
    shortBio: '16 years of experience specialising in strength training, fat loss, and lifestyle transformation.',
    fullBio: `Tutor at Image Fitness Training, delivering education in Group Instruction, Fitness Instruction and Personal Training.

A graduate of the University of Limerick (NCEF), with Image Fitness qualifications in Fitness Instruction and Personal Training, along with Advanced Personal Training (Level 2) and Precision Nutrition Coaching Levels 1 and 2.

My journey into the fitness industry began after being diagnosed with Crohn's disease at a young age. After multiple surgeries and ongoing lifelong medication treatment, I discovered that consistent training and a wholefoods-based approach to nutrition significantly improved my quality of life. Through fitness, I was able to regain control of my health — an experience that ignited a lifelong passion for fitness and for helping others pursue a career in health and fitness.

With 16 years of experience in the industry, I specialise in strength training, fat loss, and lifestyle transformation. I am deeply passionate about the positive ripple effect that training and a healthy nutrition approach can have on people's lives, creating a positive effect through all areas of their lives.

As a former Image Fitness student myself, I understand exactly what it feels like to sit in the classroom at the beginning of the journey. My teaching style is relaxed, enjoyable, engaging and supportive, focused on helping each student build confidence, develop real-world skills and bring out the very best in themselves — both during the course and throughout their careers in the fitness industry.

My hobbies include training daily — it's a non-negotiable for me for my physical and mental wellbeing. I enjoy a daily hike with my dog, taking advantage of living close to the Dublin mountains, and I enjoy podcasts and a nice steak dinner on the weekend.

My philosophy in life is: If you wanna look and live like the 1%, you have to do what the other 99% won't.`,
    image: '/tutors/gary.jpg'
  },
  {
    name: 'Stefano Manassero',
    role: 'Senior Tutor',
    location: 'Dublin',
    shortBio: '41 years in the fitness industry, former bodybuilding national champion, international judge, and body transformation specialist.',
    fullBio: `I am a Senior Tutor at Image Fitness Training. I am a qualified fitness instructor, personal trainer, neuromuscular therapist, and nutritional coach. I have been in the fitness industry since 1984 — 41 years.

I started in the fitness industry by chance as I was rehabilitating a back injury that forced me to stop playing football. Since I first put a foot in a gym, I was home. Within 4 months I was managing that gym and became a gym instructor and a massage therapist more or less at the same time. Since then, I have qualified in many other disciplines directly or indirectly related to physical activities, injuries, or wellbeing.

I have been a bodybuilding national champion and represented Ireland in many World and international competitions. I have coached World, European, and national champions and became a recognised international bodybuilding judge. I was also involved in professional football for many years and helped with fitness and prevention of injuries at Bohemians FC, contributing to two national league titles and FAI Cup wins.

I specialise in body transformation and photoshoot preps, but mostly now I enjoy training people of any age who want to transform their bodies and their lives. I enjoy helping the more mature population, male and female, who want to be healthier and experience a more active and more fun life.

I co-own a fitness studio where I run semi-private personal training classes.`,
    image: '/tutors/stef.png'
  },
  {
    name: 'Mark White',
    role: 'S&C Tutor',
    location: 'Dublin',
    shortBio: 'Over 20 years in fitness with BSc in S&C and Master\'s in Performance Coaching, passionate about long-term athlete development.',
    fullBio: `With over 20 years in the fitness industry, I've dedicated my career to empowering individuals and teams to reach their physical potential through science-backed strength and conditioning. Holding a BSc in Strength and Conditioning and a Master's in the Science of Performance Coaching, I integrate rigorous academic research with practical, field-tested strategies to optimise performance and wellbeing.

Through my own strength and conditioning consultancy, I firmly believe these principles apply universally — not just to elite athletes, but to people of all ages and backgrounds. My tailored programmes support diverse needs, from long-term athletic development in youth to rehabilitation following sports injuries, surgery, or joint and muscle issues. By prioritising individual physiology, progressive loading, and recovery science, I help clients build resilience, enhance movement quality, and sustain lifelong health.

I'm deeply passionate about long-term athlete development (LTAD) and advocate strongly for more coaches to receive comprehensive education on this critical topic. Understanding the distinct stages of athletic growth — from foundational movement skills to peak performance — is essential for sustainable success, and I prioritise this in all my work.

As a former competitor in athletics, soccer, GAA, basketball, and triathlon, I draw on firsthand experience across multiple disciplines to inform my coaching. I hold a particular passion for advancing women's sport, delivering specialised guidance on female-specific physiology, hormonal influences, and developmental stages to ensure equitable opportunities and optimal outcomes.

Students on the course I tutor can expect a hands-on, practical experience packed with real-world problem-solving, effective communication strategies, and insights into addressing individual athlete needs. Coaching, to me, is a refined skill — one that evolves through continuous education, reflection, and empathy. I'm committed to equipping athletes, coaches, and enthusiasts with the knowledge and tools for sustainable progress.`,
    image: '/tutors/mark.png'
  },
  {
    name: 'Darragh Hannaphy',
    role: 'Tutor & Gym Manager',
    location: 'Dublin',
    shortBio: 'Tutor at Image Fitness and Gym Manager at FLYEfit Northside with 17 years of industry experience.',
    fullBio: `Fitness, to me, is more than lifting weights or following a workout plan. It's about building strength, discipline, confidence, and a positive mindset. Over the past 17 years, I've worked with hundreds of individuals of different fitness levels, from beginners taking their first steps into the gym to advanced athletes striving to break their limits.

My love for fitness comes from playing professional football in the League of Ireland from 19 years of age. From then, I was lucky enough to own my own studio for group classes and personal training. In 2016, I ventured into the coffee business and opened a coffee shop called The Grind in Howth.

Seeing the students gain so much confidence throughout the courses is what drives me every day. My mission is simple: to inspire, educate, and empower people to become the strongest version of themselves.`,
    image: '/tutors/darragh.png'
  },
  {
    name: 'Nina Plazanin',
    role: 'Pilates & PT Tutor',
    location: 'Dublin',
    shortBio: 'Qualified PT, Fitness Instructor and Pilates Teacher. Passionate about helping people become stronger, more confident and connected to their bodies.',
    fullBio: `Qualified Personal Trainer, Fitness Instructor and Pilates Teacher. Passionate about helping people become stronger, more confident and connected to their bodies.

My journey into fitness started as a personal one. I wanted to feel better — physically and mentally. Shortly after, that turned into a lifestyle and a career. Through discipline, education and consistency, I learned how powerful movement can be in transforming not just the body, but mindset, confidence and overall quality of life.

After completing my qualifications in Personal Training, Fitness and Pilates, I continued to grow within the academy and I am now proud to work as a tutor for Combination and Pilates courses. Supporting and mentoring future instructors is something I genuinely care about — because it was something I experienced when doing my own course, and having that help meant everything.

I aim to help my students not only gain knowledge but also build confidence and step into this industry with purpose.

Alongside tutoring, I work as a Fitness and Pilates Instructor, run my own coaching business, and work in corporate performance and wellbeing — delivering classes, programmes and events that focus on long-term results. My approach is realistic, combining everything I know, and empowering. I don't believe in quick fixes — I believe in building strong foundations that last.

I am passionate about creating a positive and supportive environment where people feel motivated, capable and inspired to push beyond their limits and become the strongest version of themselves. Because once, I was that person sitting at the back hoping nobody would ask me a question — and now I get to help and inspire others to step out of their comfort zone.`,
    image: '/tutors/nina.png'
  },
  {
    name: 'Aisling Duignan',
    role: 'Pre & Post Natal Tutor',
    location: 'Dublin',
    shortBio: 'Specialist in pre and post natal fitness, helping women safely exercise through every stage of motherhood.',
    fullBio: '',
    image: '/tutors/aisling.png'
  },
  {
    name: 'Diarmuid Cavanagh',
    role: 'NutriCert Global Tutor',
    location: 'Dublin',
    shortBio: 'Nutrition specialist delivering the NutriCert Global qualification with a practical, science-backed approach.',
    fullBio: '',
    image: '/tutors/diarmuid.png'
  },
  // — Cork —
  {
    name: 'Tomas Whelan',
    role: 'Lead Tutor — Personal Training & Pilates',
    location: 'Cork',
    shortBio: 'Lead Tutor in PT and Pilates courses. Boxing coach turned PT, Pilates Instructor and head coach at FLYEfit — with nearly 5 years tutoring at Image Fitness.',
    fullBio: `Lead Tutor 👀 In our personal training and Pilates courses. Also life of the party at summer and Xmas events.

I started out as a boxing coach in 2013 and became a PT in 2015, nutrition coach in 2020 and Pilates Instructor in 2022.

I've been working as a personal trainer and an online coach for myself now for over a decade. I've learned that everyone is motivated to becoming healthier and stronger but people often have a lack in confidence or ability to do so. I take pride in being a coach who can guide an individual through healthy changes and show them how to reach their full potential.

Be useful is my mantra. As a Dad, Husband and a Coach. Be useful in this role and give it your best.

Along with working for myself I'm also the head coach of FLYEfit.

I've been a tutor now for nearly 5 years with Image. In class I get to bring my experience to the students and show them the real life workings of a coach in this industry. They can hear about my wins and losses as a coach and learn from them. I try to make the classroom a bit of craic and keep our learning as practical and interactive as we can. Best way to learn is to do.

I'm a Tipp man now living in Cork and I'll never let them forget about the 2025 All Ireland hurling final down here.

Aside from fitness I love my Xbox and Switch. I read a lot of Fantasy and I'm that guy who is always looking to bring Lord of the Rings into a conversation.

I'm a first time Dad as of this year and wow. What a feeling. Less Xbox now days but I get to read Tolkien to him so happy days.

See you in class!`,
    image: '/tutors/thomas.png'
  },
  {
    name: 'Greg Magner',
    role: 'Tutor & Examiner',
    location: 'Cork',
    shortBio: 'Focuses on client transformation and sustainable fitness habits.',
    fullBio: '',
    image: '/tutors/greg.png'
  },
  {
    name: 'Eoin Cremin',
    role: 'Tutor & Fitness Business Accelerator Mentor',
    location: 'Cork',
    shortBio: 'Online coaching specialist in fat loss and resistance training, in the industry since 2012.',
    fullBio: `I work as a tutor and business mentor with Image Fitness! I run my own online coaching business where I specialise in fat loss and resistance training.

My love of sports led me to begin working in the fitness industry in 2012.

My coaching philosophy is all about sustainability. I have a sweet tooth myself and love chocolate, so it's only fair my clients can enjoy some as well!`,
    image: '/tutors/eoin.png'
  },
  // — Galway —
  {
    name: 'Sharon Gannon',
    role: 'Tutor & Gym Manager',
    location: 'Galway',
    shortBio: '9 years in the fitness industry, Gym Manager at HQ Gym Tuam, passionate about teaching and empowering future coaches.',
    image: '/tutors/sharon.png',
    fullBio: `I've been in the fitness industry for the past nine years, starting out as a group fitness instructor in a small fitness studio. Two years later, I started in the same gym I still work in today. I later completed my Personal Training qualification with Image Fitness (after a little push from my boss who saw potential in me!), and that experience gives me a real understanding of what our students go through.

My time coaching on the gym floor saw me working closely with members who wanted to improve their lifting technique, including Olympic lifting, as well as coaching women who wanted to build strength and tone up in a supportive, empowering way.

I'm now manager of the gym where I started, and that journey from coach to manager has shaped how I see the industry — it's about meeting people where they're at, holding high standards, and never losing the human element in what we do.

Becoming a tutor and examiner with Image Fitness felt like a natural next step, as teaching has always been something I love. I'm passionate about helping future coaches build confidence, competence and real-world understanding.

Outside the gym, you'll usually find me sea swimming at Blackrock Tower in Galway — often with my daughter, who was inspired to complete the Image Fitness course herself and even went on to win Student of the Year.`,
  },
  // — Limerick —
  {
    name: 'May Turner',
    role: 'Senior Tutor & S&C Coach',
    location: 'Limerick',
    shortBio: 'Strength & conditioning coach, personal trainer and senior tutor at IFT. Former nurse with a passion for functional movement, women\'s health, and weightlifting for longevity.',
    fullBio: `Hi, I'm May!

I am a strength & conditioning coach, personal trainer and senior tutor here at IFT.

I have been working in care roles since 2015 — starting out in nursing. My passion for weightlifting and being part of helping people to get stronger was a big motivation for a change of direction with my career. I have a special interest in functional movement for a purpose, whether it's sports performance or general health-based. Pre/post injury and women's health, weightlifting for longevity and as we age are huge passions of mine. I love making the gym an all-inclusive space.

I love the whole approach to training — building programmes that cater to the individual, ensuring clients gain education in weightlifting technique and movement awareness. Coaching, for me, is a communication between both client and coach to facilitate their process of gaining strength and confidence in the gym. I find my work extremely motivating and rewarding.

I have been working with Image Fitness Training for almost 5 years now. I am always learning and extremely humbled to be part of students' journeys in becoming coaches. I love to stay in touch with past students — it's inspiring to see them do well and gain work they enjoy. I began tutoring on the Cork courses initially and two years ago we added the courses to a new location in Limerick, where I am currently based.

My work schedule is a mix between being a mum, 1-1 hours with my own clients, coaching strength & conditioning classes, caring for patients in a GP Clinic, and tutoring students. The variety day to day is something I love. The focus is all centred around care and community, which I'm so grateful for. My son will always be the main focus and drive for everything I do.`,
    image: '/tutors/may.png'
  },
  {
    name: 'Lisa McCaffrey',
    role: 'Tutor',
    location: 'Limerick',
    shortBio: 'Tutor based in Limerick, dedicated to developing the next generation of fitness professionals.',
    fullBio: '',
    image: '/tutors/lisa.png'
  },
  // — Manchester —
  {
    name: 'Dan Needham',
    role: 'Tutor',
    location: 'Manchester',
    shortBio: 'Fitness professional bringing expert coaching and real-world experience to students in Manchester.',
    fullBio: '',
    image: '/tutors/dan.png'
  },
  {
    name: "Rebecca O'Rourke",
    role: 'Tutor',
    location: 'Manchester',
    shortBio: 'Passionate fitness tutor dedicated to developing confident, skilled personal trainers in Manchester.',
    fullBio: '',
    image: '/tutors/rebecca.png'
  },
  // — International / Specialists —
  {
    name: 'Jordan Sherlock',
    role: 'Fitness Business Accelerator Mentor',
    location: 'Dubai',
    shortBio: 'After 8 years in corporate, Jordan backed himself — built a thriving global online coaching business from Dubai, and now helps new PTs do the same through the FBA.',
    fullBio: `After 8 years grinding in a corporate job that looked great on paper but felt empty inside, I finally made the leap. I backed myself — and I built something better.\n\nOver the last number of years, I've grown a thriving online coaching business that allows me to work with high-level clients from all over the world — all while living a nomadic lifestyle based from Dubai.\n\nMy roster is full. My business is solid. And I've done it all without relying on gimmicks or endless Instagram reels.\n\nNow, I'm focused on helping new personal trainers build the same kind of freedom — without wasting years trying to figure it all out alone.\n\nI know the overwhelm you're feeling:\n→ Where do I even start?\n→ How do I stand out?\n→ Can I actually make this work?\n\nYou can. And I'll help you get there — step by step.\n\nInside the FBA, I'll show you how to move from "just qualified" to fully booked. From lost and unsure to clear, confident, and in control of your business.\n\nI've walked this path. Now I'll walk it with you.\n\nLet's build something you're proud of — and make a living doing what you love.`,
    image: '/tutors/jordan-sherlock.jpg'
  },
  // — Marketing / Social / Office —
  {
    name: 'Adam Ward',
    role: 'Head of Marketing & Digital Media',
    location: 'Dublin',
    shortBio: 'Expert in business development for fitness professionals.',
    fullBio: '',
    image: '/tutors/adam.png'
  },
  {
    name: "Shauna O'Mahoney",
    role: 'Social Media Team',
    location: 'Dubai',
    shortBio: 'Online coach helping women build muscle, lose body fat, and develop confidence through strength training.',
    fullBio: `I'm part of the FBA team here at Image Fitness Training. I coach women online to become the best version of themselves — both mentally and physically — through structured training and personalised nutrition.

While I work with a wide range of clients, my passion lies in helping women build muscle, lose body fat, and develop confidence through strength training. Having previously coached in person, I now work primarily online, which allows me to provide daily support, accountability, and guidance tailored to each client's lifestyle.

My journey into fitness began during a challenging period in my life. The gym became my escape — a space where I focused on improving myself day by day. That experience gave me purpose and ultimately shaped my mission: to help other women rediscover their strength, confidence, and self-belief through fitness.

I strongly believe that fitness goes far beyond appearance. The mental benefits, resilience, and long-term health improvements are truly life-changing — looking good is simply a bonus.

Interestingly, I wasn't naturally sporty growing up and didn't enjoy PE at school. It wasn't until completing my Personal Training qualification that I fully understood the impact of strength training and proper nutrition on overall health. Now, I'm passionate about helping women prioritise their wellbeing not just for today, but for their future selves.

A mindset I always share with clients is: If you were 30 failures away from your goal, how quickly would you want to fail? Progress requires action, patience, and persistence — and you never know what's possible until you try!`,
    image: '/tutors/shauna.png'
  },
  {
    name: 'Shannon Seier',
    role: 'Marketing & Social Media Team',
    location: 'Galway',
    shortBio: 'Marketing and social media team member at Image Fitness Training.',
    fullBio: '',
    image: '/tutors/shanon.png'
  },
  {
    name: 'Fabiana Creedon',
    role: 'Office Team',
    location: 'Dublin',
    shortBio: 'Expert in functional training and injury prevention.',
    fullBio: '',
    image: '/tutors/fabiana.png'
  },
  {
    name: 'Katie Doolan',
    role: 'Sales & Office Team',
    location: 'Dublin',
    shortBio: 'Part of the Image Fitness sales and office team, helping students find the right course and supporting them every step of the way.',
    fullBio: '',
    image: null
  },
]

const pilatsTutors = [
  { name: "Aisling O'Leary", role: 'Pilates Tutor & Studio Owner', image: '/tutors/aisling-oleary.jpg',  initials: 'AO', bio: "Graduated Image Pilates 2024, now a tutor and founder of Grove Pilates Studio in Cork City. A student turned tutor — bringing a fresh, real-world perspective to every class." },
  { name: 'Holly Ring',      role: 'Pilates Instructor',           image: '/tutors/holly.jpg',           initials: 'HR', bio: 'Image Pilates graduate turned tutor — bringing the student perspective and reformer expertise to every session.' },
  { name: 'Rachel Edwards',  role: 'Pilates Instructor',           image: '/tutors/rachel-edwards.jpg',  initials: 'RE', bio: 'Reformer specialist dedicated to empowering students through hands-on, energetic instruction.' },
  { name: 'Aoife McIntyre',  role: 'Pilates Instructor',           image: '/tutors/aoife-mcintyre.jpg',  initials: 'AM', bio: 'Bringing warmth and expertise to every session, with a focus on inclusive, accessible Pilates.' },
  { name: 'Amy Halligan',    role: 'Pilates Instructor',           image: '/tutors/amy.png',             initials: 'AH', bio: 'Dedicated to creating a welcoming space where every student feels supported and confident.' },
]

export default function TeamContent() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 })
  const [selectedTutor, setSelectedTutor] = useState<typeof tutors[0] | null>(null)

  return (
    <>
      {/* Tutor Profile Modal */}
      <AnimatePresence>
        {selectedTutor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedTutor(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-charcoal-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedTutor(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-charcoal-800/80 hover:bg-charcoal-700 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              <div className="flex flex-col md:flex-row max-h-[85vh] overflow-y-auto">
                {/* Photo Side */}
                <div className="relative w-full md:w-2/5 aspect-square md:aspect-auto md:min-h-[400px] shrink-0">
                  {!selectedTutor.image ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-charcoal-800 to-charcoal-950">
                      <div className="text-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full bg-charcoal-700 flex items-center justify-center">
                          <span className="text-4xl md:text-5xl font-bold text-gold">
                            {selectedTutor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">Photo coming soon</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={selectedTutor.image}
                      alt={selectedTutor.name}
                      fill
                      className="object-cover object-top"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent md:bg-gradient-to-r" />
                </div>

                {/* Content Side */}
                <div className="flex-1 p-5 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {selectedTutor.name}
                    </h3>
                    <p className="text-gold font-medium text-lg mb-2">{selectedTutor.role}</p>
                    <div className="flex items-center gap-2 text-white/60">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedTutor.location}</span>
                    </div>
                  </div>

                  {selectedTutor.fullBio ? (
                    <div className="space-y-4">
                      <Quote className="w-8 h-8 text-gold/30" />
                      {selectedTutor.fullBio.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="text-white/80 leading-relaxed">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/60 italic">Full bio coming soon...</p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Meet Our <span className="text-gold">World-Class</span> Team
            </h1>
            <p className="text-lg sm:text-xl text-white/70">
              Industry experts, passionate educators, and dedicated mentors committed to your success.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Photo */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[21/9] rounded-2xl overflow-hidden"
          >
            <Image
              src="/team-photo-new.jpg"
              alt="Image Fitness Training Team"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <p className="text-gold font-medium">The Image Fitness Family</p>
              <p className="text-white/70 text-sm">20+ dedicated professionals nationwide</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section ref={ref} className="py-16 sm:py-24 bg-charcoal-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Our <span className="text-gold">Tutors</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Every tutor brings real-world experience and a passion for developing the next generation of fitness professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {tutors?.map?.((tutor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (index % 10) * 0.05, duration: 0.4 }}
                className="bg-charcoal-800 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedTutor(tutor)}
              >
                {/* Photo */}
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal-900">
                  {!tutor?.image ? (
                    // Initials placeholder for missing photos
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-charcoal-800 to-charcoal-950">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-charcoal-700 flex items-center justify-center">
                          <span className="text-3xl font-bold text-gold">
                            {tutor?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                        <p className="text-white/60 text-sm">Photo coming soon</p>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={tutor.image}
                      alt={tutor?.name ?? 'Tutor'}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-transparent to-transparent" />
                  
                  {/* Read More Overlay */}
                  {tutor?.fullBio && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="px-4 py-2 bg-gold text-charcoal-950 rounded-full text-sm font-medium">
                        View Profile
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1">{tutor?.name ?? ''}</h3>
                  <p className="text-gold text-sm mb-2">{tutor?.role ?? ''}</p>
                  <div className="flex items-center gap-1 text-white/50 text-xs">
                    <MapPin className="w-3 h-3" />
                    {tutor?.location ?? ''}
                  </div>
                </div>
              </motion.div>
            )) ?? null}
          </div>

          {/* Gold divider + Pilates sub-section */}
          <div className="mt-16 pt-14 border-t border-gold/30">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1 bg-gold/20" />
              <p className="text-gold text-sm font-medium tracking-widest uppercase">Specialist Pilates Tutors</p>
              <div className="h-px flex-1 bg-gold/20" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {pilatsTutors.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="group"
                >
                  <div className="relative overflow-hidden mb-3 rounded-xl bg-charcoal-800" style={{ aspectRatio: '3/4' }}>
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-charcoal-800 to-charcoal-900">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute rounded-full" style={{ width: '90px', height: '90px', border: '1px solid rgba(184,146,46,0.25)' }} />
                          <div className="absolute rounded-full" style={{ width: '72px', height: '72px', border: '1px solid rgba(184,146,46,0.45)' }} />
                          <span className="relative text-4xl font-light text-gold" style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.12em' }}>
                            {member.initials}
                          </span>
                        </div>
                        <div className="absolute top-4 left-4 w-5 h-5" style={{ borderTop: '1px solid rgba(184,146,46,0.4)', borderLeft: '1px solid rgba(184,146,46,0.4)' }} />
                        <div className="absolute top-4 right-4 w-5 h-5" style={{ borderTop: '1px solid rgba(184,146,46,0.4)', borderRight: '1px solid rgba(184,146,46,0.4)' }} />
                        <div className="absolute bottom-4 left-4 w-5 h-5" style={{ borderBottom: '1px solid rgba(184,146,46,0.4)', borderLeft: '1px solid rgba(184,146,46,0.4)' }} />
                        <div className="absolute bottom-4 right-4 w-5 h-5" style={{ borderBottom: '1px solid rgba(184,146,46,0.4)', borderRight: '1px solid rgba(184,146,46,0.4)' }} />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.88) 0%, transparent 55%)' }}>
                      <p className="text-white/90 text-xs leading-relaxed line-clamp-3">{member.bio}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-white leading-tight">{member.name}</p>
                  <p className="text-xs mt-0.5 text-gold">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 sm:py-24 bg-charcoal-950">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-gold" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">20+</p>
              <p className="text-white/60">Expert Tutors</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-7 h-7 text-gold" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">100+</p>
              <p className="text-white/60">Combined Years Experience</p>
            </div>
            <div>
              <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-gold" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">7</p>
              <p className="text-white/60">Locations Nationwide</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
