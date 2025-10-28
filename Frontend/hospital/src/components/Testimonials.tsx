"use client";

import { useEffect, useState } from "react";
import { useCallback } from "react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Dr. Rajesh Kumar",
      role: "Senior Cardiologist",
      location: "Apollo Hospital, Delhi",
      content:
        "Swasth Raho has revolutionized how I manage my practice. The intuitive dashboard and patient management system helps me provide better care to my patients.",
      rating: 5,
      icon: (
        <svg
          className="w-16 h-16 text-blue-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: "Priya Sharma",
      role: "Patient",
      location: "Mumbai",
      content:
        "Being able to book appointments, access my medical records, and consult with doctors online has made healthcare so much more accessible. The AI assistance is particularly helpful!",
      rating: 5,
      icon: (
        <svg
          className="w-16 h-16 text-pink-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: "Dr. Sarah Wilson",
      role: "Pediatrician",
      location: "Max Healthcare, Bangalore",
      content:
        "The platform's integration of AI with traditional healthcare practices is impressive. It helps me make better-informed decisions and provide more personalized care to my young patients.",
      rating: 5,
      icon: (
        <svg
          className="w-16 h-16 text-purple-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      name: "Rahul Verma",
      role: "Hospital Administrator",
      location: "City Hospital, Pune",
      content:
        "Swasth Raho has streamlined our entire hospital management process. From appointment scheduling to patient records, everything is now efficiently managed in one place.",
      rating: 5,
      icon: (
        <svg
          className="w-16 h-16 text-green-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  }, [testimonials.length]);

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000); // Auto scroll every 5 seconds
    return () => clearInterval(interval);
  }, [nextTestimonial]);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real experiences from doctors and patients who chose Swasth Raho for
            better healthcare
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-full flex-shrink-0 px-4">
                  <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-6">{testimonial.icon}</div>
                      <div className="mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-2xl">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-600 text-lg mb-6 italic">
                        "{testimonial.content}"
                      </p>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {testimonial.name}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {testimonial.role}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
