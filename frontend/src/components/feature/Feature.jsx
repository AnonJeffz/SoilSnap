import { useNavigate } from "react-router";
import { useState } from "react";

export default function Feature() {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleNavigate = (path) => {
    if (isExiting) return;
    setIsExiting(true);
    // wait for the CSS transition to finish, then navigate
    setTimeout(() => navigate(path), 500);
  };

  return (
    <section
      className="relative min-h-screen bg-cover bg-center flex flex-col justify-between"
      style={{
        backgroundImage: "url('/images/feature/farming.jpeg')"
      }}
    >
      {/* Logo */}
      <div className="p-5 ml-1">
        {/* <h1 className="text-3xl font-bold text-white">
          SoilSnap 
        </h1> */}
        <img src="/images/feature/Logo.png" alt="Logo" width={40} />
      </div>

      {/* Hero Content */}
      <div className="flex flex-col items-center text-center text-white px-6">

        {/* Title */} 
        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Cultivate Better, Grow Stronger<br /> AI-Driven Farming Solutions
        </h2>

        {/* Subtitle */}
        <p className="mt-4 max-w-2xl text-lg text-gray-200">
          Transform your farming approach with advanced soil classification and tailored crop recommendations for maximum productivity and sustainability.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={() => handleNavigate("/home")}
            disabled={isExiting}
            className="bg-lime-400 text-black font-semibold px-5 py-2 rounded-full shadow-lg hover:bg-lime-500 transition"
          >
            Get Started →
          </button>
          <button onClick={handleNavigate("/about-soil")}
            disabled={isExiting}
            className="bg-black/80 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-black transition">
            Download
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center p-6 text-white">
        <div className="flex items-center gap-3 bg-black/50 px-4 py-2 rounded-full">
        </div>
        <div className="flex items-center gap-3 bg-black/50 px-4 py-2 rounded-full">          
        </div>
      </div>
    </section>
  );
}
