import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "../components/ui/button";

export default function Contact() {
  return (
    <section id="contact" className="py-20 text-[#004179] ">  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in-up"
        
        >
          Contact Us
        </h2>
        <p
          className="text-lg sm:text-xl mb-12 max-w-2xl mx-auto animate-fade-in-up animate-delay-200"
          
        >
          Have questions? We're here to help!
        </p>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* Sisi Kiri: Informasi Kontak */}
          <div className="w-full md:w-1/2 space-y-8 text-left animate-slide-in-left animate-delay-400">
            <div className="flex items-center space-x-4">
              <Mail className="w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-bold" >
                  Email
                </h4>
                <a href="mailto:info@ubud.com" className="text-lg hover:underline transition-colors duration-300" >
                  @UBUD.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Phone className="w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-bold" >
                  Phone
                </h4>
                <p className="text-lg" >
                  +62 0815 1000 3535
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <MapPin className="w-8 h-8 flex-shrink-0" />
              <div>
                <h4 className="text-xl font-bold" >
                  Address
                </h4>
                <p className="text-lg" >
                  St. Jakarta No. 88, Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Formulir Kontak */}
          <div className="w-full md:w-1/2 p-8 rounded-2xl shadow-2xl bg-white text-gray-800 animate-slide-in-right animate-delay-600">
            <h3
              className="text-3xl font-bold mb-6 text-[#1c6ea4]"
              
            >
              Send Us a Message
            </h3>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-left"
              
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#1c6ea4] focus:outline-none transition-colors"
                  placeholder="Masukkan nama Anda"
                 
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-left"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#1c6ea4] focus:outline-none transition-colors"
                  placeholder="Masukkan email Anda"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-left"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-[#1c6ea4] focus:outline-none transition-colors"
                  placeholder="Tulis pesan Anda di sini"
                ></textarea>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1c6ea4] text-[#ffffff] px-6 py-3 text-lg font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:bg-[#154D71]"
              
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}