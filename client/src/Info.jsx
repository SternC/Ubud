import { Sparkles, GraduationCap, Users, Heart } from "lucide-react";

export default function Info() {
  return (
    <section className="py-20 text-[#FFFBDE] bg-gradient-to-t from-[#000B58] to-[#1c6ea4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up"
            style={{ fontFamily: "Dream Road" }}
          >
            Tentang Kami
          </h2>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in-up animate-delay-200"
            style={{ fontFamily: "Raleway" }}
          >
            Temukan potensi terbaikmu bersama UBUD, teman belajar yang siap mendampingi setiap langkahmu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Sisi Kiri: Deskripsi */}
          <div className="space-y-6 text-center md:text-left animate-slide-in-left animate-delay-400">
            <h3
              className="text-3xl font-bold leading-tight"
              style={{ fontFamily: "Dream Road" }}
            >
              UBUD: Solusi Pembelajaran Inovatif untuk Masa Depan
            </h3>
            <p className="leading-relaxed" style={{ fontFamily: "Raleway" }}>
              UBUD didirikan dengan visi untuk menghadirkan pendidikan yang lebih mudah diakses dan menyenangkan. Kami percaya setiap individu memiliki cara belajar unik, dan teknologi adalah alat untuk membuka potensi tersebut. Dengan kurikulum yang fleksibel dan instruktur yang berpengalaman, kami berkomitmen untuk menjadi mitra terpercaya dalam perjalanan akademis Anda.
            </p>
            <p className="leading-relaxed" style={{ fontFamily: "Raleway" }}>
              Sejak awal, kami telah membantu ribuan siswa meraih nilai terbaik, mengembangkan bakat, dan mempersiapkan diri menghadapi tantangan masa depan. Kami bukan sekadar platform, kami adalah komunitas.
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
                  Inovasi Tanpa Batas
                </h4>
                <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                  Kami terus mengembangkan solusi pembelajaran terbaru, dari materi interaktif hingga kurikulum yang dinamis.
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
                  Standar Akademis Global
                </h4>
                <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                  Materi kami disusun berdasarkan standar akademis internasional, memastikan Anda siap bersaing di tingkat global.
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
                  Pendekatan yang Humanis
                </h4>
                <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                  Kami peduli dengan setiap individu. Pembelajaran di UBUD dirancang untuk menumbuhkan motivasi dan kepercayaan diri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}