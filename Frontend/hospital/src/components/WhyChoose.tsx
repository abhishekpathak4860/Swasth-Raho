"use client";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// 1. Define the rotating group
const CarouselGroup = ({ features }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  // INCREASED RADIUS: Pushed them out a bit so they don't overlap
  const radius = 2.8;

  return (
    <group ref={groupRef}>
      {features.map((feature, index) => {
        const angle = (index / features.length) * Math.PI * 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <group key={index} position={[x, 0, z]} rotation={[0, angle, 0]}>
            {/* ADDED SCALE: This is the magic bullet to make the whole card smaller in 3D */}
            <Html transform occlude center scale={0.6}>
              {/* REDUCED WIDTH: Changed w-64 to w-48 */}
              <div className="w-48 aspect-[1.15/1] bg-gradient-to-br from-blue-400/90 to-blue-300/90 backdrop-blur-md rounded-xl flex flex-col items-center justify-center text-center p-4 shadow-xl border border-white/20">
                <div className="mb-2 p-2 rounded-full bg-white shadow-md">
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="object-contain h-6 w-6" // Made icon slightly smaller too
                  />
                </div>
                <h3 className="text-xs font-semibold text-gray-800">
                  {feature.title}
                </h3>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// 2. The Main Page Component
const WhyChoose3D = () => {
  const features = [
    { title: "Complete Healthcare Ecosystem", icon: "/image1.jpg" },
    { title: "Patient-Centric Design", icon: "/image2.webp" },
    { title: "Smart Hospital Management", icon: "/image3.jpg" },
    { title: "Doctor's Professional Suite", icon: "/image4.webp" },
    { title: "AI-Powered Healthcare", icon: "/image5.jpg" },
    { title: "Secure & Reliable", icon: "/image6.jpg" },
  ];

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#f8faff] to-[#f0f9ff] flex flex-col">
      <div className="text-center pt-16 pb-8 z-10 relative">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          Why Choose Swasth Raho?
        </h2>
      </div>

      <div className="flex-1 w-full relative">
        {/* PULLED CAMERA BACK: Changed Z position from 8 to 10 to zoom out */}
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <CarouselGroup features={features} />
        </Canvas>
      </div>
    </div>
  );
};

export default WhyChoose3D;
