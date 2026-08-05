import AboutMe from '@/components/AboutMe';
import HowIThink from '@/components/HowIThink';
import Experience from '@/components/Experience';

export default function AboutSection() {
  return (
    <section id="about">
      <AboutMe />
      <HowIThink />
      <Experience />
    </section>
  );
}