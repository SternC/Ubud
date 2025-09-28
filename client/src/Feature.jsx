import { BookOpen, Award, Users, Lightbulb } from "lucide-react";


export default function Features() {
  return (
    <section 
        id="features" 
        className="relative py-20 text-[#004179] "
      >

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up"
          
        >
          Why Us ?
        </h2>
        <p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto animate-fade-in-up animate-delay-200"
          
        >
          We are here to transform your learning experience. Discover features designed to help you reach your full potential.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">


          {/* Fitur 1: Pembelajaran Personal */}
          <div className="bg-[#FFFBDE] p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-400">
            <div className="mb-4 text-[#154D71]">
              <BookOpen className="w-12 h-12 mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-[#1c6ea4]"
             
            >
              Personalized Learning
            </h3>
            <p className="text-gray-600">
              Curriculum tailored to your learning style and pace, ensuring every material is absorbed optimally.
            </p>
          </div>


          {/* Fitur 2: Sertifikasi & Penghargaan */}
          <div className="bg-[#FFFBDE] p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-500">
            <div className="mb-4 text-[#154D71]">
              <Award className="w-12 h-12 mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-[#1c6ea4]"
            >
              Certification & Awards
            </h3>
            <p className="text-gray-600" >
              Achieve official certificates and awards for every accomplishment. Prove your skills and enhance your academic profile.
            </p>
          </div>


          {/* Fitur 3: Komunitas Belajar */}
          <div className="bg-[#FFFBDE] p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-600">
            <div className="mb-4 text-[#154D71]">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-[#1c6ea4]"
            >
              Study Group
            </h3>
            <p className="text-gray-600">
              Join a supportive and active community. Discuss, share, and grow with peers.
            </p>
          </div>

          {/* Fitur 4: Kuis Interaktif */}
          <div className="bg-[#FFFBDE] p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-700">
            <div className="mb-4 text-[#154D71]">
              <Lightbulb className="w-12 h-12 mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-[#1c6ea4]"
            >
              Interactive Quiz
            </h3>
            <p className="text-gray-600">
              Test your knowledge with fun, interactive quizzes that adapt to your learning progress.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}