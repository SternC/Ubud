import React from "react";
import Coach from "../ui/coach";

export function Coachdeck() {
const coaches = [
{
id: 1,
name: "Coach Bill",
specialty: "Frontend Development",
image: "bill.jpg",
},
{
id: 2,
name: "Coach Albert",
specialty: "Mathematics",
image: "albert.webp",
},
];

return ( <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8"> <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
{coaches.map((coach) => ( <div key={coach.id} className="flex flex-col items-center text-center"> <Coach
           imageSrc={coach.image}
           altText={coach.name}
           captionText={coach.specialty}
           imageHeight="250px"
           imageWidth="250px"
           scaleOnHover={1.05}
           rotateAmplitude={12}
         /> <h3 className="mt-3 text-base sm:text-lg font-semibold text-gray-800">
{coach.name} </h3> <p className="text-sm text-gray-500">{coach.specialty}</p> </div>
))} </div> </div>
);
}
