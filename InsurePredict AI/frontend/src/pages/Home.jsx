import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen bg-white relative overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center z-10"
      >
        <motion.h1 
          className="text-5xl md:text-6xl font-bold mb-6 text-black"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to
          <br />
          <span className="text-gray-800">Insurance Churn Prediction</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 text-lg mb-8 max-w-md mx-auto"
        >
          Make data-driven decisions with our advanced prediction model
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/predict" 
            className="inline-block bg-black text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition-shadow duration-300"
          >
            Start Prediction →
          </Link>
        </motion.div>
      </motion.div>

      {/* Background Elements */}
      <motion.div
        className="absolute top-20 right-[20%] w-72 h-72 bg-gray-50 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 left-[20%] w-64 h-64 bg-gray-100 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default Home;
