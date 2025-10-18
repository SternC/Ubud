import React from "react";
import Coach from "../ui/coach";
import useAuth from "../../src/hook/useAuth";

export function Coachdeck() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (user?.is_coach) return null;

  const coaches = [
    { id: 1, name: "Coach Bill", specialty: "Frontend Development", image: "bill.jpg" },
    { id: 2, name: "Coach Albert", specialty: "Mathematics", image: "albert.webp" },
  ];

  return (
    <div className="border border-dashed border-gray-300 rounded-lg lg:h-160 px-4 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 min-h-[85vh]">
      {coaches.map((coach) => (
        <div
          key={coach.id}
          className="flex flex-col items-center text-center rounded-xl"
        >
          <div className="mb-0"> 
            <Coach
              imageSrc={coach.image}
              altText={coach.name}
              captionText={coach.specialty}
              imageHeight="200px"
              imageWidth="200px"
              scaleOnHover={1.05}
              rotateAmplitude={12}
            />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-0">
            {coach.name}
          </h3>
          <p className="text-sm text-gray-500">{coach.specialty}</p>
        </div>
      ))}

      <div className="flex flex-col items-center justify-center text-center mt-4 sm:col-span-2 md:col-span-3">
        <a
          href="/coach-login"
          className="mt-2 px-5 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors duration-300"
        >
          Join as Coach
        </a>
      </div>
    </div>
  );
}
