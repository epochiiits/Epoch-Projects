import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./index_r.css";

const Card = ({ name, description, image, link }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const handleClick = () => {
    if (name) {
      navigate('/club/'+name);
    }
  };

 // Animation animate-fadeInUp on scroll . Also IntersectionObserver API is used to trigger the animation
 

  return (
    <div className="relative" ref={cardRef}>
      <div
        className="relative w-[190px] h-[258px] mx-20 my-6 flex flex-col justify-end p-3 gap-3 rounded-lg bg-black cursor-pointer 
                   transition-transform duration-300 hover:scale-105 hover:shadow-xl group"
        onClick={handleClick}
      >
        {/* Gradient Border */}
        <div
          className="absolute -inset-1 rounded-[10px] z-[-10] bg-gradient-to-br from-pink-500 to-blue-400 opacity-80
                     group-hover:rotate-[-90deg] group-hover:scale-x-[1.34] group-hover:scale-y-[0.77] transform transition-all duration-500"
        ></div>

        {/* Glow Effect */}
        <div
          className="absolute inset-0 rounded-[10px] z-[-20] bg-gradient-to-br from-fuchsia-500 to-teal-400 blur-[20px]
                     scale-[0.95] transform transition-filter duration-500 group-hover:blur-[30px]"
        ></div>

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center rounded-lg"
          style={{ backgroundImage: `url(${image})` }}
        ></div>

        {/* Content */}
        <div className="relative z-10 text-left">
          <h3 className="text-[20px] font-bold text-white capitalize">{name}</h3>
          <p className="text-[14px] text-white mt-1">{description}</p>
          <p className="text-[14px] font-semibold text-pink-400">Learn More</p>
        </div>
      </div>
    </div>
  );
};
export default Card;