import React from "react";
import Coach from "../ui/coach";

export function Coachdeck() {
  const coaches = [
    { id: 1, name: "Coach Bill", specialty: "Frontend Development", image: "bill.jpg" },
    { id: 2, name: "Coach Albert", specialty: "Mathematics", image: "albert.webp" },
  ];

  return (
     <div className="border border-dashed border-gray-300 rounded-lg lg:h-160 px-4 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
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
    </div>
  );
}
