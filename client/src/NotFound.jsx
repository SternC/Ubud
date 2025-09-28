import react, { useState, useEffect } from "react";
import { Link } from "react-router-dom";


function NotFound(){
    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#fff1da] via-[#8cecff] to-[#0486ba] flex items-center justify-center">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight text-balance" style={{ color: "#154D71", fontFamily: "Dream Road" }}>
                    404 - Page Not Found
                </h1>
                <p className="text-xl sm:text-2xl leading-relaxed text-pretty" style={{ color: "#154D71", fontFamily: "Raleway" }}>
                    Sorry, the page you are looking for does not exist.
                </p>
                <Link to="/" className="mt-8 inline-block bg-[#004179] text-[#fff2ce] px-6 py-3 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_15px_#91C8E4] hover:shadow-blue-200/60 hover:bg-[#4cb6f8d2]">
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default NotFound;