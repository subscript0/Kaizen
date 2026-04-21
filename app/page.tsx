import Banner from '@/components/Banner';
import AboutMe from '@/components/AboutMe';
import Skills from '@/components/Skills';
import HowIThink from '@/components/HowIThink';
import InteractiveDemo from '@/components/InteractiveDemo';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <Banner />

      {/* 2. About + personal positioning */}
      <AboutMe />

      {/* 3. Tech stack */}
      <Skills />

      {/* 4. Philosophy — differentiation */}
      <HowIThink />

      {/* 5. Interactive proof of capability */}
      <InteractiveDemo />

      {/* 6. Career authority */}
      <Experience />

      {/* 7. Project case studies — primary conversion driver */}
      <Projects />

      {/* 8. Social proof */}
      <Testimonials />

      {/* 9. Final CTA */}
      <Footer />
    </>
  );
}
