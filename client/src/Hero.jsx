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

 
      <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" rel="stylesheet" />

      <section className="min-h-screen relative overflow-hidden bg-gradient-to-b bg-[#fff8e7] flex items-center justify-center">
        <div className="absolute inset-0">
            <Background
              colors={['#8DD8FF', '#91C8E4', '#fffefb']}
              mouseForce={20}
              cursorSize={100}
              isViscous={false}
              viscous={10}
              iterationsViscous={10}
              iterationsPoisson={32}
              resolution={0.5}
              isBounce={false}
              autoDemo={true}
              autoSpeed={0.4}
              autoIntensity={2}
              takeoverDuration={0.1}
              autoResumeDelay={3000}
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
                  className="group bg-[#004179] text-[#fff8e7] px-20 py-8 text-4xl font-bold rounded-3xl transition-all duration-300 hover:scale-115 hover:shadow-[0_0_90px_30px_#91C8E4] hover:shadow-blue-200/70 hover:bg-[#4cb6f8d2] animate-pulse-glow w-full sm:w-auto font-raleway"
                >
                  Get Started
                  <ArrowRight className="ml-4 w-10 h-10 transition-transform group-hover:translate-x-3" />
                </Button>

              </Link>
            </div>

              <div className="flex flex-col sm:flex-row gap-6 text-sm opacity-0 animate-slide-in-left animate-delay-600">
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
                    style={{ fontFamily: "Raleway, sans-serif" }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110"
                      style={{ color: "#FFFBDE", backgroundColor: "transparent" }}
                    >
                      {item.icon}
                    </div>
                    <span className="transition-colors group-hover:text-highlight" style={{ color: "#FFFBDE" }}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center lg:justify-start gap-6 pt-8 opacity-0 animate-fade-in-up animate-delay-600">
                {[
                  {
                    icon: BookOpen,
                    label: "Literature",
                    color: "bg-accent/20 hover:bg-accent/30",
                  },
                  {
                    icon: Calculator,
                    label: "Math",
                    color: "bg-accent/20 hover:bg-accent/30",
                  },
                  {
                    icon: Palette,
                    label: "Arts",
                    color: "bg-accent/20 hover:bg-accent/30",
                  },
                  {
                    icon: Users,
                    label: "Social",
                    color: "bg-accent/20 hover:bg-accent/30",
                  },
                ].map((subject, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 group cursor-pointer">
                    <div
                      className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}
                    >
                      <subject.icon
                        className="w-8 h-8 transition-transform group-hover:scale-110"
                        style={{ color: "#FFFBDE" }}
                      />
                    </div>
                    <span
                      className="text-xs transition-colors group-hover:text-highlight font-medium"
                      style={{ color: "#FFFBDE" }}
                    >
                      {subject.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative opacity-0 animate-fade-in-up animate-delay-400">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-highlight/30 rounded-full blur-2xl animate-pulse"></div>
              <div
                className="absolute -bottom-6 -left-6 w-40 h-40 bg-accent/20 rounded-full blur-2xl animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Tambahkan id pada komponen lainnya */}
      <Features />
      <Info />
      <Contact />
    </>
  )
}
