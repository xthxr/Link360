import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import SocialProof from "@/components/SocialProof";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-deep-black bg-gradient-base">
      <Navigation />
      <main>
        <Hero />
        <SocialProof />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
