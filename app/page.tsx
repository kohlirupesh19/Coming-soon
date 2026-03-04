import AlgorithmPlayground from "@/components/AlgorithmPlayground";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Process from "@/components/Process";
import Services from "@/components/Services";
import TechStack from "@/components/TechStack";
import Vision from "@/components/Vision";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-x-clip">
        <Hero />
        <Services />
        <AlgorithmPlayground />
        <Process />
        <TechStack />
        <Vision />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
