import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import Lottie from "lottie-react";
import animationData from "../assets/Animation - 1743762631975.json"; // Ensure correct path

// **3D Infinity Logo Component**
const InfinityLogo3D = () => {
  const logoRef = useRef();

  // **Rotation Animation**
  useFrame(() => {
    if (logoRef.current) {
      logoRef.current.rotation.y += 0.01; // Smooth Rotation
    }
  });

  // **Gradient Material**
  const gradientTexture = new THREE.TextureLoader().load("/gradient.png"); // Ensure this is a pink-purple gradient image
  gradientTexture.wrapS = THREE.RepeatWrapping;
  gradientTexture.wrapT = THREE.RepeatWrapping;

  return (
    <mesh ref={logoRef} rotation={[Math.PI / 2, 0, 0]}>
      <torusKnotGeometry args={[1.2, 0.4, 150, 20]} />
      <meshStandardMaterial 
        map={gradientTexture} 
        emissive={"#ff00ff"} // Soft Neon Glow
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.9}
      />
    </mesh>
  );
};

// **Home Page**
const Home = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-700 p-10 text-white space-y-16">
      
      {/* 3D Canvas - Positioned at the Top */}
      <div className="absolute top-12 w-full h-36 flex justify-center">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} />
          <InfinityLogo3D />
          <OrbitControls autoRotate enableZoom={false} />
        </Canvas>
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left space-y-16 md:space-y-0 md:space-x-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {/* Left Section - Text */}
        <div className="max-w-lg space-y-6">
          <motion.h1 
            className="text-6xl font-extrabold drop-shadow-xl hover:scale-105 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Welcome to <span className="text-yellow-300">Insurance Churn Prediction</span>
          </motion.h1>
          <motion.p 
            className="text-lg bg-black/40 p-6 rounded-lg shadow-lg hover:bg-black/60 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            Predict customer churn using advanced AI models. Get insights and take action!
          </motion.p>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link
              to="/predict"
              className="bg-yellow-400 text-black font-semibold px-8 py-4 rounded-lg shadow-xl hover:bg-yellow-500 transition transform hover:-translate-y-1"
            >
              Go to Prediction Page 🚀
            </Link>
          </motion.div>
        </div>

        {/* Right Section - Lottie Animation with Hover Effect */}
        <motion.div 
          className="w-80 h-80 cursor-pointer hover:scale-110 transition-transform duration-300"
          whileHover={{ scale: 1.1 }}
        >
          <Lottie animationData={animationData} loop={true} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
