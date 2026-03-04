import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ServicesDetails from "@/components/ServicesDetails";

export const metadata: Metadata = {
  title: "Services | Akruit Labs",
  description:
    "Explore Akruit Labs services across web app development, AI solutions, mobile apps, cloud infrastructure, UI/UX, and product engineering."
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="relative overflow-x-clip">
        <ServicesDetails />
      </main>
      <Footer />
    </>
  );
}
