import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Process } from "@/components/Process";
import { Sectors } from "@/components/Sectors";
import { Services } from "@/components/Services";
import { Statement } from "@/components/Statement";
import { WorkRail } from "@/components/WorkRail";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        <Hero />
        <Statement />
        <WorkRail />
        <Services />
        <Sectors />
        <Marquee />
        <Process />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
