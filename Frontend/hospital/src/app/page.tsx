import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Services from "../components/Services";
import WhyChoose from "../components/WhyChoose";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Enhanced Navbar */}
      <Header />
      {/* Hero Section */}
      <Hero />
      {/* Services Section */}
      <Services />
      {/* Features Section */}
      <Features />
      {/* Why Choose Section */}
      <WhyChoose />
      {/* Testimonials Section */}
      <Testimonials />
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
