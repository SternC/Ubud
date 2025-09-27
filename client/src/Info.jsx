import { Sparkles, GraduationCap, Users, Heart } from "lucide-react";

export default function Info() {
  return (
    <section id="info" className="py-20 text-[#FFFBDE] bg-gradient-to-t from-[#000B58] to-[#1c6ea4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up"
            style={{ fontFamily: "Dream Road" }}
          >
            About Us
          </h2>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in-up animate-delay-200"
            style={{ fontFamily: "Raleway" }}
          >
            Escalate your knowledge with UBUD
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Sisi Kiri: Deskripsi */}
          <div className="space-y-6 text-center md:text-left animate-slide-in-left animate-delay-400">
            <h3
              className="text-3xl font-bold leading-tight"
              style={{ fontFamily: "Dream Road" }}
            >
              UBUD is More Than Just a Learning Platform
            </h3>
            <p className="leading-relaxed" style={{ fontFamily: "Raleway" }}>
              Built with passion and dedication, UBUD has been at the forefront of educational innovation since its inception. Our platform is designed to cater to the unique needs of each learner, providing a seamless and engaging experience.
            </p>
            <p className="leading-relaxed" style={{ fontFamily: "Raleway" }}>
              Since our launch, we have empowered thousands of students and educators worldwide, fostering a community of lifelong learners. Our commitment to excellence and continuous improvement drives us to deliver top-notch educational content and tools.
            </p>
          </div>

          {/* Sisi Kanan: Keunggulan Kami */}
          <div className="space-y-8 animate-slide-in-right animate-delay-600">
            {/* Item Keunggulan */}
            <div className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-[#FFFBDE]/10 hover:shadow-lg">
              <div className="flex-shrink-0 mt-1">
                <Sparkles className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold" style={{ fontFamily: "Dream Road" }}>
                  Innovative Solutions
                </h4>
                <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                  We leverage cutting edge technology to create a dynamic learning environment that adapts to the evolving needs of our users.
                </p>
              </div>
            </div>
            {/* Item Keunggulan */}
            <div className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-[#FFFBDE]/10 hover:shadow-lg">
              <div className="flex-shrink-0 mt-1">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold" style={{ fontFamily: "Dream Road" }}>
                  Global Standards
                </h4>
                <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                  Our courses and certifications meet international standards, ensuring that our learners are well-prepared for the global stage.
                </p>
              </div>
            </div>
            {/* Item Keunggulan */}
            <div className="flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-[#FFFBDE]/10 hover:shadow-lg">
              <div className="flex-shrink-0 mt-1">
                <Heart className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-bold" style={{ fontFamily: "Dream Road" }}>
                  Humanic Approach
                </h4>
                <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                  We prioritize the human element in education, fostering meaningful connections between students and instructors to enhance the learning experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}