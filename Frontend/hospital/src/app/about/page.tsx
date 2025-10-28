import React from "react";
import Image from "next/image";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import WhyChoose from "../../components/WhyChoose";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <Image
          src="/image7.jpg"
          alt="Healthcare Hero"
          fill
          className="object-cover brightness-[0.8]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                About Swasth Raho
              </h1>
              <p className="text-xl md:text-2xl text-blue-100">
                Revolutionizing healthcare through technology and compassion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Who We Are Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Who We Are
            </h2>
            <div className="space-y-6 text-gray-600">
              <p className="text-lg leading-relaxed">
                Swasth Raho is a pioneering healthcare management platform that
                bridges the gap between patients, doctors, and healthcare
                facilities. Founded with a vision to make quality healthcare
                accessible to all, we leverage cutting-edge technology to create
                a seamless healthcare experience.
              </p>
              <p className="text-lg leading-relaxed">
                Experience cutting-edge healthcare with Dr. Meera Sharma, our AI
                doctor with voice and vision capabilities, providing 24/7
                primary care guidance.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-gray-600">
                    To transform healthcare delivery through technology, making
                    it more accessible, efficient, and patient-centric while
                    maintaining the highest standards of care and security.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-semibold text-green-600 mb-4">
                    Our Vision
                  </h3>
                  <p className="text-gray-600">
                    To become India's most trusted healthcare ecosystem, where
                    technology and human touch combine to provide exceptional
                    healthcare experiences for everyone.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WhyChoose />
      <Footer />
    </div>
  );
}
