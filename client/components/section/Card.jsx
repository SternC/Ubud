import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileCard() {
  const [flipped, setFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    age: "",
    interest: "",
    skill: "",
    city: "",
  });
  const [role, setRole] = useState("student");

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios
      .get("http://localhost:5000/authentication")
      .then((res) => {
        if (res.status === 200) {
          axios.get("http://localhost:5000/profile").then((resProfile) => {
            setProfile(resProfile.data);
            axios
              .get("http://localhost:5000/coaches")
              .then((resCoach) => {
                const coach = resCoach.data.find(
                  (c) => c.profileId === resProfile.data.id
                );
                if (coach && coach.status === "approved") {
                  setRole("coach");
                }
              })
              .catch(() => setRole("student"));
          });
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:5000/profile", profile)
      .then((res) => {
        if (res.status === 200) setIsEditing(false);
      })
      .catch((err) => console.error("Profile update error:", err.response || err));
  };

  return (
    <div
      className="relative w-[220px] h-[200px] [perspective:1000px] cursor-pointer"
      onClick={() => !isEditing && setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center justify-center gap-1 [backface-visibility:hidden]">
          <div className="w-18 h-18 bg-red-400 rounded-full flex items-center justify-center">
            <img src="logo.png" alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <h2 className="text-xl font-bold text-[#6D94C5]">
            {profile.name || "Name"}
          </h2>
          <h3 className="text-sm text-gray-600">{role}</h3>
          <p className="text-gray-600 text-lg">{profile.email || "-"}</p>
        </div>

        <div className="absolute inset-0 bg-[#ffffe8] rounded-3xl shadow-2xl p-6 flex flex-col justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              {!isEditing ? (
                <>
                  <h2 className="font-bold text-gray-600">
                    {profile.name || "Name"}
                  </h2>
                  <p className="text-gray-600 font-semibold">
                    Age: {profile.age?.trim() || "-"}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    Interest: {profile.interest?.trim() || "-"}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    Skill: {profile.skill?.trim() || "-"}
                  </p>
                  <p className="text-gray-600 font-semibold">
                    City: {profile.city?.trim() || "-"}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    className="mt-3 text-xs bg-white text-black px-4 py-1 rounded-xl shadow hover:bg-blue-600 hover:text-white transition"
                  >
                    Edit
                  </button>
                </>
              ) : (
                <form
                  onSubmit={handleSave}
                  className="flex flex-col gap-1 w-full max-w-[250px] text-left text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  {["name", "age", "interest", "skill", "city"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      value={profile[field]}
                      onChange={handleChange}
                      className="p-1 text-black rounded-lg border border-gray-300 bg-transparent"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    />
                  ))}
                  <button
                    type="submit"
                    className="mt-1 text-xs bg-green-500 text-white px-4 py-1 rounded-xl shadow hover:bg-green-600 transition"
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
  );
}
