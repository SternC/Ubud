import { BookOpen, Award, Users, Lightbulb } from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-t from-[#1c6ea4] to-[#000B58] text-[#FFFBDE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up"
          style={{ fontFamily: "Dream Road" }}
        >
          Mengapa Kami Pilihan Terbaik?
        </h2>
        <p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto animate-fade-in-up animate-delay-200"
          style={{ fontFamily: "Raleway" }}
        >
          Kami hadir untuk mengubah cara belajar Anda. Temukan fitur-fitur yang dirancang khusus untuk membantu Anda meraih potensi maksimal.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Fitur 1: Pembelajaran Personal */}
          <div className="bg-[#FFFBDE] p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-400">
            <div className="mb-4 text-[#154D71]">
              <BookOpen className="w-12 h-12 mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-[#1c6ea4]"
              style={{ fontFamily: "Dream Road" }}
            >
              Pembelajaran Personal
            </h3>
            <p className="text-gray-600" style={{ fontFamily: "Raleway" }}>
              Kurikulum yang disesuaikan dengan gaya belajar dan kecepatan Anda, memastikan setiap materi terserap dengan optimal.
            </p>
          </div>

          {/* Fitur 2: Sertifikasi & Penghargaan */}
          <div className="bg-[#FFFBDE] p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-500">
            <div className="mb-4 text-[#154D71]">
              <Award className="w-12 h-12 mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-[#1c6ea4]"
              style={{ fontFamily: "Dream Road" }}
            >
              Sertifikasi & Penghargaan
            </h3>
            <p className="text-gray-600" style={{ fontFamily: "Raleway" }}>
              Raih sertifikat resmi dan penghargaan untuk setiap pencapaian. Buktikan keahlian Anda dan tingkatkan profil akademis.
            </p>
          </div>

          {/* Fitur 3: Komunitas Belajar */}
          <div className="bg-[#FFFBDE] p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-600">
            <div className="mb-4 text-[#154D71]">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-[#1c6ea4]"
              style={{ fontFamily: "Dream Road" }}
            >
              Komunitas Belajar
            </h3>
            <p className="text-gray-600" style={{ fontFamily: "Raleway" }}>
              Bergabung dengan komunitas yang aktif dan suportif. Berdiskusi, berbagi, dan tumbuh bersama teman-teman seperjuangan.
            </p>
          </div>

          {/* Fitur 4: Kuis Interaktif */}
          <div className="bg-[#FFFBDE] p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-700">
            <div className="mb-4 text-[#154D71]">
              <Lightbulb className="w-12 h-12 mx-auto" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-[#1c6ea4]"
              style={{ fontFamily: "Dream Road" }}
            >
              Kuis Interaktif
            </h3>
            <p className="text-gray-600" style={{ fontFamily: "Raleway" }}>
              Uji pemahaman Anda dengan kuis interaktif yang menyenangkan dan informatif. Belajar jadi lebih efektif!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}