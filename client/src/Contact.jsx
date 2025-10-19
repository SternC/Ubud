import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
  return (
    <footer id="contact" className="py-10 text-[#004179]">  
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h3
          className="text-3xl sm:text-4xl font-bold mb-3 animate-fade-in-up"
        >
          Get In Touch
        </h3>
        <p
          className="text-md sm:text-lg mb-8 max-w-2xl mx-auto animate-fade-in-up animate-delay-200"
        >
          Contact us using the information below
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-16 items-start text-left">
          
          <div className="space-y-4 animate-fade-in-up animate-delay-400">
            <div className="flex items-start space-x-3">
              <Mail className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold">
                  Email
                </h4>
                <a href="mailto:info@ubud.com" className="text-md hover:underline transition-colors duration-300">
                  @UBUD.com
                </a>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 animate-fade-in-up animate-delay-500">
            <div className="flex items-start space-x-3">
              <Phone className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold">
                  Phone
                </h4>
                <p className="text-md">
                  +62 0815 1000 3535
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 animate-fade-in-up animate-delay-600">
            <div className="flex items-start space-x-3">
              <MapPin className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-lg font-bold">
                  Address
                </h4>
                <p className="text-md">
                  St. Jakarta No. 88, Indonesia
                </p>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-sm text-white">
          &copy; {new Date().getFullYear()} UBUD. All rights reserved.
      </div>
    </footer>
  );
}