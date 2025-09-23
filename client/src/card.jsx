import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Card() {
  const [flipped, setFlipped] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Smith",
    email: "john.smith@gmail.com",
    age: "21",
    interest: "Coding, Design",
    skill: "React, Tailwind",
    city: "Jakarta",
  });

  axios.defaults.withCredentials = true;

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/dashboard")
      .then((res) => {
        if (res.status === 200) {
          setAuth(true);
          setMessage(res.data.message);
        } else {
          setAuth(false);
          setMessage("Please login to view this page");
        }
      })
      .catch((err) => {
        console.error(err);
        setAuth(false);
        setMessage("Please login to view this page");
      });
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFFBDE] via-[#FFF0C4] to-[#FFF9AF] flex items-center justify-center relative overflow-hidden">
      <img
        src="waves.gif"
        alt="Waves Background"
        className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-[200%] h-[50vh] object-cover opacity-70 pointer-events-none"
      />

      {auth ? (
        <>
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-4 right-4 w-14 h-14 rounded-full shadow-lg overflow-hidden hover:scale-105 transition"
          >
            <img
              src="user.jpg"
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </button>

          <div
            className="relative w-[450px] h-[350px] [perspective:1000px] cursor-pointer"
            onClick={() => !isEditing && setFlipped(!flipped)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""
                }`}
            >
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center justify-center gap-4 [backface-visibility:hidden]">
                <div className="w-24 h-24 bg-red-400 rounded-full flex items-center justify-center">
                  <img src="logo.png" alt="Logo" className="w-16 h-16 object-contain" /> {/*bs mereka replavce pake foto mereka*/}
                </div>
                <h2 className="text-2xl font-bold text-[#6D94C5]">{profile.name}</h2>
                <p className="text-gray-600 text-lg">{profile.email}</p>
              </div>

              <div className="absolute inset-0 bg-[#6D94C5] rounded-3xl shadow-2xl p-6 flex flex-col justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-red-400 rounded-full flex items-center justify-center mr-2">
                    <img src="logo.png" alt="Logo" className="w-14 h-14 object-contain" />
                  </div>
                  <div className="flex flex-col">
                    {!isEditing ? (
                      <>
                        <h2 className="text-xl font-bold text-white p-1">{profile.name}</h2>
                        <p className="text-white p-1 whitespace-normal font-semibold">
                          Age: {profile.age.trim() ? profile.age : "-"}
                        </p>
                        <p className="text-white p-1 whitespace-normal font-semibold">
                          Interest: {profile.interest.trim() ? profile.interest : "-"}
                        </p>
                        <p className="text-white p-1 whitespace-normal font-semibold">
                          Skill: {profile.skill.trim() ? profile.skill : "-"}
                        </p>
                        <p className="text-white p-1 whitespace-normal font-semibold">
                          City: {profile.city.trim() ? profile.city : "-"}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(true);
                          }}
                          className="mt-3 bg-white text-black px-4 py-1 rounded-xl shadow hover:bg-blue-600 hover:text-white transition"
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setIsEditing(false);
                        }}
                        className="flex flex-col gap-2 w-full max-w-[250px] text-left"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          className="p-1 text-white rounded-lg border border-gray-300"
                          placeholder="Name"
                        />
                        <input
                          name="age"
                          value={profile.age}
                          onChange={handleChange}
                          className="p-1 text-white rounded-lg border border-gray-300"
                          placeholder="Age"
                        />
                        <input
                          name="interest"
                          value={profile.interest}
                          onChange={handleChange}
                          className="p-1 text-white rounded-lg border border-gray-300"
                          placeholder="Interest"
                        />
                        <input
                          name="skill"
                          value={profile.skill}
                          onChange={handleChange}
                          className="p-1 text-white rounded-lg border border-gray-300"
                          placeholder="Skill"
                        />
                        <input
                          name="city"
                          value={profile.city}
                          onChange={handleChange}
                          className="p-2 text-white rounded-lg border border-gray-300"
                          placeholder="City"
                        />
                        <button
                          type="submit"
                          className="mt-3 bg-green-500 text-white px-4 py-1 rounded-xl shadow hover:bg-green-600 transition"
                        >
                          Save
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>) : (
        <>
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md text-center">
            <h1 className="text-xl font-semibold mb-2">Unauthorized</h1>
            <p className="text-gray-600">{message}</p>
            <Link
              to="/login"
              className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Go to Login
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
