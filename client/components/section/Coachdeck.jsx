import React, { useEffect, useState } from "react";
import Coach from "../ui/coach";
import useAuth from "../../src/hook/useAuth";
import api from "../../src/api";

export function Coachdeck() {
  const { user, loading } = useAuth();
  const [coaches, setCoaches] = useState([]);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await api.get("/coachesprofiles");
        setCoaches(response.data);
      } catch (err) {
        console.error("Failed to fetch coaches:", err);
      }
    };

    fetchCoaches();
  }, []);

  if (loading) return null;
  if (user?.is_coach) return null;

  return (
    <div className="border border-dashed border-gray-300 rounded-lg lg:h-160 px-4 py-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 min-h-[85vh]">
      {coaches.length > 0 ? (
        coaches.map((coach) => (
          <div
            key={coach.id}
            className="flex flex-col items-center text-center rounded-xl"
          >
            <div className="mb-0">
              <Coach
                imageSrc={coach.image || "bill.jpg"} // fallback image
                altText={coach.name}
                captionText={coach.skill || "Specialty unknown"}
                imageHeight="200px"
                imageWidth="200px"
                scaleOnHover={1.05}
                rotateAmplitude={12}
              />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mt-0">
              {coach.name}
            </h3>
            <p className="text-sm text-gray-500">{coach.skill}</p>
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No coaches available yet.
        </p>
      )}

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
