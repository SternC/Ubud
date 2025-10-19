const featuresData = [
  {
    title: "100+ Course Materials",
    description: "Access a vast library with over 100 in-depth course materials, ranging from beginner fundamentals to advanced expertise.",
    color: "text-white-400",
  },
  {
    title: "Personal Coaching Sessions",
    description: "Receive exclusive virtual one-on-one guidance from expert coaches to maximize your potential and achievement.",
    color: "text-white-300", 
  },
  {
    title: "Secure & Fast Transactions",
    description: "Enjoy an easy, transparent, and secure process for course purchase and payment with various available options.",
    color: "text-white-400", 
  },
  {
    title: "Instant 24/7 Access",
    description: "Start learning anytime, anywhere. All content is available instantly after registration with no time restrictions.",
    color: "text-white-400", 
  },
];

export default function Feature() {
  return (
    <section id="features" className="py-30 text-white bg-transparent"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <h2 className="text-4xl text-[#004179] sm:text-5xl font-extrabold mb-4 animate-fade-in-up">
          Why Choose Us?
        </h2>
        <p className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto text-[#004179] animate-fade-in-up animate-delay-200">
          We offer a unique combination of high quality materials and personalized support that will drive your success.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className={`
                p-6 rounded-2xl 
                bg-white/10
                
                shadow-xl shadow-black/30 
                
                border border-white/20

                text-left animate-slide-in-up animate-delay-${400 + index * 200}
              `}
            >
              
              <h3 className={`text-xl text-[#004179] font-bold mb-3 ${feature.color}`}>
                {feature.title}
              </h3>
              <p className="text-[#004179]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}