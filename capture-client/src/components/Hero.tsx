import React from "react";

import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="h-[1050px] bg-hero bg-no-repeat bg-cover bg-center py-20">
      <div className="container mx-auto flex justify-around h-full items-center">
        {/* Virtual Art Gallery */}
        <div className="text-center">
          <div className="font-bold text-cyan-700 text-lg mb-3"></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-transparent bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text">The Pilot<br />
            <span className="text-zinc-500 font-normal">"In the dance of death among the stars, hesitation is a waltz with oblivion"</span>
          </h1>
          <Link target="_blank" to={'/game-play'} className='inline-block uppercase font-semibold border-b-2 border-primary text-cyan-600 hover:text-cyan-700 transition duration-300 ease-in-out py-1'>Explore Now</Link>
        </div>
      </div>
    </section>


  );
};

export default Hero;
