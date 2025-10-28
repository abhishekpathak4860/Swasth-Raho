"use client";

const WhyChoose = () => {
  const features = [
    {
      title: "Complete Healthcare Ecosystem",
      description:
        "A unified platform connecting hospitals, doctors, and patients seamlessly. Manage appointments, medical records, and consultations in one integrated system.",
      icon: "/image1.jpg",
    },
    {
      title: "Patient-Centric Design",
      description:
        "24/7 appointment booking, real-time chat with doctors, voice-enabled AI assistant Dr. Meera Sharma, and comprehensive patient dashboard for better healthcare management.",
      icon: "/image2.webp",
    },
    {
      title: "Smart Hospital Management",
      description:
        "Dedicated hospital dashboard with advanced analytics, patient records management, and integrated pharmacy system for efficient healthcare delivery.",
      icon: "/image3.jpg",
    },
    {
      title: "Doctor's Professional Suite",
      description:
        "Feature-rich dashboard for doctors to manage appointments, view patient history, conduct online consultations, and maintain digital prescriptions.",
      icon: "/image4.webp",
    },
    {
      title: "AI-Powered Healthcare",
      description:
        "Experience cutting-edge healthcare with Dr. Meera Sharma, our AI doctor with voice and vision capabilities, providing 24/7 primary care guidance.",
      icon: "/image5.jpg",
    },
    {
      title: "Secure & Reliable",
      description:
        "Enterprise-grade security for patient data, encrypted communications, and reliable cloud infrastructure ensuring 99.9% uptime.",
      icon: "/image6.jpg",
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      <section className="relative py-16 bg-gradient-to-br from-[#f8faff] to-[#f0f9ff]">
        <style jsx>{`
          .clip-hexagon {
            clip-path: polygon(
              25% 0%,
              75% 0%,
              100% 50%,
              75% 100%,
              25% 100%,
              0% 50%
            );
          }
          .hexagon-container {
            display: grid;
            grid-template-columns: repeat(1, minmax(280px, 320px));
            gap: 1.5rem;
            padding: 1rem;
            margin: 0 auto;
            justify-content: center;
            max-width: 100%;
            width: 100%;
          }
          @media (min-width: 640px) {
            .hexagon-container {
              grid-template-columns: repeat(2, minmax(250px, 300px));
              gap: 2rem;
            }
            .hexagon-container > div:nth-child(2n) {
              transform: translateY(2rem);
            }
          }
          @media (min-width: 1024px) {
            .hexagon-container {
              grid-template-columns: repeat(3, minmax(250px, 300px));
              gap: 2rem;
            }
            .hexagon-container > div:nth-child(2n) {
              transform: translateY(0);
            }
            .hexagon-container > div:nth-child(3n-1) {
              transform: translateY(2.5rem);
            }
          }
        `}</style>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Why Choose Swasth Raho?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your complete healthcare ecosystem connecting patients, doctors,
              and hospitals with cutting-edge AI technology for better
              healthcare delivery.
            </p>
          </div>{" "}
          <div className="hexagon-container p-2">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="w-full aspect-[1.15/1] relative">
                  <div className="absolute inset-0 clip-hexagon bg-gradient-to-br from-blue-400/90 to-blue-300/90 backdrop-blur-sm ">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                      <div className="mb-3 p-3 rounded-full bg-white/90 shadow-lg">
                        <div className=" relative">
                          <img
                            src={feature.icon}
                            alt={feature.title}
                            className="object-contain h-10 w-10"
                          />
                        </div>
                      </div>
                      <h3 className="text-[15px] font-semibold mb-2 text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-[12px] leading-relaxed max-w-[220px]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Decorative Elements */}
          <div className="fixed pointer-events-none opacity-50 top-1/4 -right-32 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="fixed pointer-events-none opacity-50 top-3/4 -left-32 w-64 h-64 bg-green-100/30 rounded-full blur-3xl" />
        </div>
      </section>
    </div>
  );
};
export default WhyChoose;
