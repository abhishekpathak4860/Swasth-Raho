import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Services from "@/components/Services";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Enhanced Navbar */}
      <Header />
      {/* Hero Section */}
      <Hero />
      {/* Services Section */}
      <Services />
      {/* Footer Section */}
      <Footer />
    </div>
  );
}
