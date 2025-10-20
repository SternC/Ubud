import Maintext from "../components/ui/maintext"
import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import { BookOpen, Calculator, Palette, Users, ArrowRight } from "lucide-react"
import Navbar from "../components/ui/Navbar"
import Features from "./Feature"
import Info from "./Info"
import Contact from "./Contact"
import TextType from "../components/ui/texttype"
import Background from "../components/ui/background"

export default function Hero() {
  return (
    <>
      <Navbar />


      <section id = 'hero' className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#fff1da] via-[#8cecff] to-[#0486ba] flex items-center justify-center ">
        <div className="absolute inset-0">
           
         <Background
              colors={['#9fcfe8', '#beeaff']}
              mouseForce={12}
              cursorSize={800}
              isViscous={false}
              viscous={10}
              iterationsViscous={10}
              iterationsPoisson={5}
              resolution={0.5}
              isBounce={true}
              autoDemo={true}
              autoSpeed={0.25}
              autoIntensity={2}
              takeoverDuration={0.05}
              autoResumeDelay={200}
              autoRampDuration={0.6}
            />
            </div>
        <div className="relative z-10 w-full max-w-none mx-auto px-8 sm:px-12 lg:px-16 pt-32 pb-24">
          <div className="grid lg:grid-cols-1 gap-16 items-center justify-center min-h-[85vh] max-w-7xl mx-auto">
            <div className="text-center space-y-10 flex flex-col items-center justify-center">
              <Maintext
                text="Welcome to UBUD!"
                className="text-6xl sm:text-7xl lg:text-8xl font-bold text-center leading-tight  text-[#004179]"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
               
              />
             <TextType
                text={["Your best study buddy.", 
                  "Discover personalized courses tailored just for you.", 
                  "Match with expert instructors who understand your needs!"]}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="_"
              />

            <div className="flex flex-col sm:flex-row gap-8 opacity-0 animate-fade-in-up animate-delay-600">
              <Link to="/register" className="w-full sm:w-auto">
               <Button
                  className="group bg-[#004179] text-[#fff8e7] px-20 py-8 text-2xl font-bold rounded-3xl transition-all duration-300 hover:scale-115 hover:shadow-[0_0_90px_30px_#91C8E4] hover:shadow-blue-200/70 hover:bg-[#4cb6f8d2] animate-pulse-glow w-full sm:w-auto font-raleway"
                >
                  Get Started
                  <ArrowRight className="ml-4 w-10 h-10 transition-transform group-hover:translate-x-3" />
                </Button>

              </Link>
            </div>

              <div className="flex flex-col sm:flex-row gap-6 text-lg opacity-0 animate-slide-in-left animate-delay-600 text-[#004179]">
                {[
                  {
                    icon: "✓",
                    text: "Free to start",
                  },
                  {
                    icon: "✓",
                    text: "Match with instructors",
                  },
                  {
                    icon: "✓",
                    text: "Learn at your pace",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center group cursor-pointer"
                   
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110"
                      style={{ color: "#004179", backgroundColor: "transparent" }}
                    >
                      {item.icon}
                    </div>
                    <span className="transition-colors group-hover:text-highlight" style={{ color: "#004179" }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

           
            </div>
          </div>
          
      <Features />
      <Info />
      <Contact />
        </div>
      </section>

  
    </>
  )
}
