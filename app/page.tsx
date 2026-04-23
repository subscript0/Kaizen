import Banner          from '@/components/Banner';
import AboutMe         from '@/components/AboutMe';
import Skills          from '@/components/Skills';
import HowIThink       from '@/components/HowIThink';
import InteractiveDemo from '@/components/InteractiveDemo';
import Experience      from '@/components/Experience';
import Projects        from '@/components/Projects';
import GitHubStats     from '@/components/GitHubStats';
import Testimonials    from '@/components/Testimonials';
import Footer          from '@/components/Footer';
import WhatsAppCTA     from '@/components/WhatsAppCTA';
import IdeaFloatingButton from '@/components/IdeaFloatingButton';

export default function Home() {
  return (
    <>
      <Banner />
      <AboutMe />
      <Skills />
      <HowIThink />
      <InteractiveDemo />
      <Experience />
      <Projects />
      <GitHubStats />
      <Testimonials />
      <Footer />
      <WhatsAppCTA />
      <IdeaFloatingButton />
    </>
  );
}