import { Briefcase, Lightbulb, Users } from "lucide-react";

export default function About() {
  return (
    <section className="py-20 bg-[#f5f0cd] text-[#1c6ea4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up"
          style={{ fontFamily: "Dream Road" }}
        >
          Cerita di Balik UBUD
        </h2>
        <p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto animate-fade-in-up animate-delay-200"
          style={{ fontFamily: "Raleway" }}
        >
          Kami percaya pendidikan adalah kunci untuk membuka masa depan.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Sisi Kiri: Deskripsi Singkat */}
          <div className="space-y-6 text-center md:text-left animate-slide-in-left animate-delay-400">
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Raleway" }}>
              UBUD berawal dari sebuah ide sederhana: membuat proses belajar menjadi lebih mudah, fleksibel, dan personal. Di tengah dunia yang terus berubah, kami menyadari bahwa metode belajar tradisional sering kali tidak cukup. Itulah mengapa kami menciptakan sebuah platform yang tidak hanya menyediakan materi, tetapi juga menghubungkan siswa dengan instruktur terbaik, menciptakan komunitas yang mendukung, dan menyesuaikan diri dengan kebutuhan unik setiap pelajar.
            </p>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "Raleway" }}>
              Misi kami adalah memberdayakan jutaan siswa dan pendidik untuk berkembang di era digital. Kami berkomitmen untuk menyediakan solusi pembelajaran inovatif yang relevan dengan tantangan abad ke-21.
            </p>
          </div>
          
          {/* Sisi Kanan: Visual/Illustrasi */}
          <div className="relative animate-fade-in-up animate-delay-600">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Team discussing ideas"
              className="rounded-3xl shadow-2xl transition-transform duration-500 hover:scale-[1.02]"
            />
            <div
              className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-accent/30 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        {/* Bagian Visi & Misi */}
        <div className="mt-20">
          <h3
            className="text-3xl font-bold mb-8 animate-fade-in-up"
            style={{ fontFamily: "Dream Road" }}
          >
            Visi & Misi Kami
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Visi */}
            <div className="p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-800"
              style={{ backgroundColor: "#1c6ea4", color: "#f5f0cd" }}
            >
              <div className="mb-4">
                <Lightbulb className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-2xl font-bold mb-2" style={{ fontFamily: "Dream Road" }}>
                Visi
              </h4>
              <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                Menjadi platform pembelajaran online terdepan yang menginspirasi generasi baru untuk berani bermimpi dan berinovasi.
              </p>
            </div>
            {/* Misi 1 */}
            <div className="p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-900"
              style={{ backgroundColor: "#1c6ea4", color: "#f5f0cd" }}
            >
              <div className="mb-4">
                <Briefcase className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-2xl font-bold mb-2" style={{ fontFamily: "Dream Road" }}>
                Misi
              </h4>
              <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                Menyediakan materi pembelajaran berkualitas tinggi yang relevan dengan kebutuhan industri masa kini dan masa depan.
              </p>
            </div>
            {/* Misi 2 */}
            <div className="p-8 rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in-up animate-delay-1000"
              style={{ backgroundColor: "#1c6ea4", color: "#f5f0cd" }}
            >
              <div className="mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <h4 className="text-2xl font-bold mb-2" style={{ fontFamily: "Dream Road" }}>
                Misi
              </h4>
              <p className="text-sm" style={{ fontFamily: "Raleway" }}>
                Membangun komunitas belajar yang suportif dan inklusif, di mana setiap orang merasa dihargai.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}