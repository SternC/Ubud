

import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen, Calculator, Palette, Users, ArrowRight } from "lucide-react";
import Navbar from "../components/ui/Navbar"; // Perbaikan path impor
import Features from "./Feature";
import Info from "./Info";
import Contact from "./Contact";

export default function Hero() {
  return (
    <>
      {/* Navbar tetap di atas */}
      <Navbar />

      {/* Load Chewy Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap"
        rel="stylesheet"
      />

      <section className="min-h-screen relative overflow-hidden bg-gradient-to-b bg-[#ffffe8] flex items-center justify-center">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-6">
                <h1
                  className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight text-balance opacity-0 animate-fade-in-up"
                  style={{ color: "#154D71", fontFamily: "Dream Road" }}
                >
                  Your Best
                  <span
                    className="block animate-fade-in-up animate-delay-200"
                    style={{ color: "#154D71", fontFamily: "Dream Road" }}
                  >
                    Study Buddy
                  </span>
                </h1>
                <p
                  className="text-xl sm:text-2xl leading-relaxed text-pretty opacity-0 animate-fade-in-up animate-delay-400"
                  style={{ color: "#154D71", fontFamily: "Raleway" }}
                >
                  Empowering students and educators to thrive in a dynamic world with cutting-edge learning solutions
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in-up animate-delay-600">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="group bg-[#004179] text-[#fff2ce] px-10 py-4 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_15px_#91C8E4] hover:shadow-blue-200/60 hover:bg-[#4cb6f8d2] animate-pulse-glow"
                    style={{ fontFamily: "Dream Road" }}
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 text-sm opacity-0 animate-slide-in-left animate-delay-600">
                {[
                  { icon: "✓", text: "Free to start" },
                  { icon: "✓", text: "Match with instructors" },
                  { icon: "✓", text: "Learn at your pace" },
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
                    <span
                      className="transition-colors group-hover:text-highlight"
                      style={{ color: "#FFFBDE" }}
                    >
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
                  <div
                    key={i}
                    className="flex flex-col items-center gap-3 group cursor-pointer"
                  >
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
              <div className="relative h-96 overflow-hidden">
                <div className="absolute inset-0">
                  <div className="absolute top-8 left-12 w-16 h-16 border-2 border-highlight/30 rounded-full animate-water-ripple"></div>
                  <div
                    className="absolute top-16 right-20 w-12 h-12 border-2 border-accent/40 rounded-full animate-water-ripple"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <div
                    className="absolute bottom-20 left-8 w-20 h-20 border-2 border-secondary/30 rounded-full animate-water-ripple"
                    style={{ animationDelay: "2s" }}
                  ></div>

                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-highlight/40 rounded-full animate-water-bubble"
                      style={{
                        left: `${20 + i * 10}%`,
                        bottom: "0px",
                        animationDelay: `${i * 0.8}s`,
                        animationDuration: `${2 + i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center animate-water-float">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-70 h-50 rounded-2xl flex items-center justify-center text-4xl font-bold text-primary mr-2">
                        <img src="/logo.png" alt="Ubud Logo" />
                      </div>
                      <div
                        className="text-9xl font-bold tracking-wider"
                        style={{
                          color: "#CBDCEB",
                          fontFamily: "'Baloo 2', sans-serif",
                        
                        }}
                      >
                        <span className="inline-block" style={{ animationDelay: "0.1s" }}>
                          B
                        </span>
                        <span className="inline-block" style={{ animationDelay: "0.2s" }}>
                          U
                        </span>
                        <span className="inline-block" style={{ animationDelay: "0.3s" }}>
                          D
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="absolute top-12 right-12 w-8 h-8 bg-highlight/60 rounded-full animate-water-float"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute bottom-16 left-16 w-6 h-6 bg-accent/60 rounded-full animate-water-float"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                <div
                  className="absolute top-32 left-8 w-4 h-4 bg-secondary/60 rounded-full animate-water-float"
                  style={{ animationDelay: "2.5s" }}
                ></div>
              </div>

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
  );
}