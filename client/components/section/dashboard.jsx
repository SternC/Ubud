import React, { useEffect, useMemo, useState } from "react";
import api from "../../src/api.jsx";

// UI COMPONENTS (unchanged)
const ProgressBar = ({ title, code, progress }) => (
  <div className="mb-5">
    <p className="text-[0.95em] mb-1 text-slate-900">
      {title} <span className="text-gray-500 text-[0.85em]">({code})</span>
    </p>
    <div className="h-2 bg-gray-200 rounded-md overflow-hidden">
      <div
        className={`h-full rounded-md transition-all duration-400 ease-in-out ${
          progress === 100 ? "bg-blue-700" : "bg-blue-500"
        }`}
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
      ></div>
    </div>
    <p className="text-right text-[0.85em] text-slate-700 mt-1">{progress}%</p>
  </div>
);

const UpcomingClassCard = ({ data }) => (
  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 shadow-md shadow-black/5 mb-4">
    <h3 className="text-[1.2em] font-semibold text-slate-900 mb-1.5">
      {data.title}
    </h3>
    <p className="text-slate-600 text-[0.95em] mb-2">{data.lecturer}</p>
    <p className="text-gray-500 text-[0.9em] my-1">{data.time}</p>
    <p
      className={`text-[0.9em] mb-4 font-medium ${
        data.status === "confirmed" ? "text-green-600" : "text-orange-600"
      }`}
    >
      Status: {data.status}
    </p>
    <button
      onClick={data.onViewSession}
      className="w-full py-2.5 bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors duration-300 hover:bg-blue-800"
    >
      Lihat Detail Appointment
    </button>
    {data.courseProgress !== undefined && (
      <p className="mt-2.5 text-slate-700 text-[0.9em]">
        Progress Kursus:{" "}
        <span className="text-blue-600 font-semibold">
          {data.courseProgress}%
        </span>
      </p>
    )}
  </div>
);

export default function Dashboard() {
  const [isCoach, setIsCoach] = useState(false);

  // data
  const [courses, setCourses] = useState([]);
  const [courseProgress, setCourseProgress] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);
  const [studentUpcomingAppointments, setStudentUpcomingAppointments] =
    useState([]);
  const [coachUpcomingClasses, setCoachUpcomingClasses] = useState([]);

  // filters
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // LOAD DASHBOARD DATA
  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const prof = await api.get("/profile", { withCredentials: true });
        if (cancelled) return;
        setIsCoach(prof.data.is_coach);

        if (!prof.data.is_coach) {
          // ===== STUDENT VIEW =====
          const [purchasesRes, appointmentsRes] = await Promise.all([
            api.get("/purchases", { withCredentials: true }),
            api
              .get("/appointments/my-appointments", { withCredentials: true })
              .catch(() => ({ data: [] })),
          ]);

          if (cancelled) return;

          // only include purchases belonging to this student
          const normalizedCourses = purchasesRes.data
            .filter((p) => p.userId === prof.data.id) // <-- FILTER HERE
            .map((p) => ({
              courseId: p.courseId ?? p.Course?.id ?? p.id,
              title:
                p.title ??
                p.Course?.title ??
                p.Course?.name ??
                "Untitled course",
              createdAt: p.createdAt ?? p.Course?.createdAt ?? p.createdAt,
              code: p.code ?? p.Course?.code ?? "",
              raw: p,
            }));

          setCourses(normalizedCourses);

          const normalizedAppointments = appointmentsRes.data
            .filter((a) => a.status !== "completed" && a.status !== "cancelled")
            .map((a) => {
              const dateObj = a.Availability?.date
                ? new Date(a.Availability.date)
                : null;
              const formattedDate = dateObj
                ? dateObj.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A";

              return {
                id: a.id,
                title: `Appointment dengan ${
                  a.coach?.Profile?.name || "Coach"
                }`,
                lecturer: a.coach?.Profile?.name || "N/A",
                time: `${formattedDate}, ${a.Availability?.time || "N/A"}`,
                status: a.status,
                courseProgress: undefined,
                session: a.Availability?.id || "N/A",
              };
            });

          setStudentUpcomingAppointments(normalizedAppointments);

          // fetch progress per course
          const progressPromises = normalizedCourses.map((c) =>
            api
              .get(`/progress/${c.courseId}`, { withCredentials: true })
              .then((r) => ({
                courseId: c.courseId,
                percent: Math.round(r.data.percent ?? 0),
              }))
              .catch(() => ({ courseId: c.courseId, percent: 0 }))
          );
          const progressResults = await Promise.all(progressPromises);
          if (cancelled) return;
          setCourseProgress(progressResults);
        } else {
          // COACH VIEW
          const coursesRes = await api.get("/courses", {
            withCredentials: true,
          });
          if (cancelled) return;

          const coachCourses = coursesRes.data;
          setCourses(coachCourses);

          const studentsRes = await api
            .get("/students-progress", { withCredentials: true })
            .catch(() => ({ data: [] }));
          if (cancelled) return;

          // Ensure each course has unique students
          setStudentProgress(
            Array.isArray(studentsRes.data) ? studentsRes.data : []
          );

          const upcomingRes = await api.get("/appointments/my-appointments", {
            withCredentials: true,
          });
          const normalizedAppointments = upcomingRes.data
            .filter((a) => a.status !== "completed" && a.status !== "cancelled")
            .map((a) => {
              const dateObj = a.Availability?.date
                ? new Date(a.Availability.date)
                : null;
              const formattedDate = dateObj
                ? dateObj.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A";

              return {
                id: a.id,
                title: `Appointment dengan ${a.student?.name || "Student"}`,
                lecturer: a.student?.name || "N/A",
                time: `${formattedDate}, ${a.Availability?.time || "N/A"}`,
                status: a.status,
                courseProgress: undefined,
                session: a.Availability?.id || "N/A",
              };
            });

          if (cancelled) return;
          setCoachUpcomingClasses(normalizedAppointments);
        }

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          console.error("Dashboard load error:", err);
          setError(err.message || "Failed to load dashboard");
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, []);

  // FILTER OPTIONS
  const availableYears = useMemo(() => {
    const years = new Set();
    courses.forEach((c) => {
      const d = c.createdAt ? new Date(c.createdAt) : null;
      if (d && !isNaN(d)) years.add(String(d.getFullYear()));
    });
    return ["All", ...Array.from(years).sort((a, b) => b - a)];
  }, [courses]);

  const months = useMemo(() => {
    return [
      "All",
      ...Array.from({ length: 12 }, (_, i) =>
        new Date(0, i).toLocaleString("id", { month: "long" })
      ),
    ];
  }, []);

  const availableDays = useMemo(
    () => ["All", ...Array.from({ length: 31 }, (_, i) => String(i + 1))],
    []
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (!course.createdAt) return true;
      const d = new Date(course.createdAt);
      if (isNaN(d)) return true;

      const year = String(d.getFullYear());
      const month = d.toLocaleString("id", { month: "long" });
      const day = String(d.getDate());

      const matchYear = selectedYear === "All" || year === selectedYear;
      const matchMonth = selectedMonth === "All" || month === selectedMonth;
      const matchDay = selectedDay === "All" || day === selectedDay;

      return matchYear && matchMonth && matchDay;
    });
  }, [courses, selectedYear, selectedMonth, selectedDay]);

  const avgProgress = useMemo(() => {
    if (filteredCourses.length === 0) return 0;
    const total = filteredCourses.reduce((acc, course) => {
      const p = courseProgress.find((x) => x.courseId === course.courseId);
      return acc + (p ? p.percent : 0);
    }, 0);
    return Math.round(total / filteredCourses.length);
  }, [filteredCourses, courseProgress]);

  if (loading)
    return (
      <div className="p-6 bg-slate-50 min-h-[85vh] text-center text-slate-700">
        Loading dashboard…
      </div>
    );
  if (error)
    return (
      <div className="p-6 bg-slate-50 min-h-[85vh] text-red-600">
        Error: {error}
      </div>
    );

  return (
    <div className="p-6 bg-slate-50 min-h-[85vh]">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* LEFT SIDE */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
          <h2 className="text-[1.4em] text-slate-900 border-b-2 border-blue-600 pb-2">
            {isCoach ? "Student Progress" : "My Progress"}
          </h2>

          {!isCoach ? (
            <>
              <div className="flex flex-wrap gap-3 mt-5 mb-5">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth("All");
                    setSelectedDay("All");
                  }}
                  className="p-2 rounded-md border border-slate-300 text-slate-700"
                >
                  {availableYears.map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSelectedDay("All");
                  }}
                  className="p-2 rounded-md border border-slate-300 text-slate-700"
                >
                  {months.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  className="p-2 rounded-md border border-slate-300 text-slate-700"
                >
                  {availableDays.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              {filteredCourses.length === 0 ? (
                <div className="text-slate-600">No courses to show.</div>
              ) : (
                filteredCourses.map((course) => {
                  const prog = courseProgress.find(
                    (p) => p.courseId === course.courseId
                  );
                  const realProgress = prog ? prog.percent : 0;
                  return (
                    <ProgressBar
                      key={course.courseId}
                      title={course.title}
                      code={course.code || course.courseId}
                      progress={realProgress}
                    />
                  );
                })
              )}

              <p className="text-right text-sm text-slate-600 mt-4">
                Rata-rata progress:{" "}
                <span className="text-blue-600 font-semibold">
                  {avgProgress}%
                </span>
              </p>
            </>
          ) : (
            // COACH VIEW
<div className="mt-5 space-y-4">
  {Array.isArray(studentProgress) && studentProgress.length > 0 ? (
    studentProgress.map((course) => (
      <div key={course.courseId} className="mb-6">
        <h3 className="font-semibold text-slate-900 text-[1.1em] mb-2">
          {course.title}
        </h3>

        <div className="space-y-4">
          {Array.isArray(course.students) && course.students.length > 0 ? (
            course.students.map((student) => (
              <div
                key={student.studentId}
                className="border p-3 rounded-lg bg-slate-50"
              >
                <p className="font-semibold text-slate-900">{student.name}</p>
                <p className="text-sm text-gray-600 mb-1">{student.course}</p>
                <ProgressBar
                  title="Progress"
                  code={student.studentId}
                  progress={
                    typeof student.progress === "number"
                      ? Math.min(Math.max(student.progress, 0), 100)
                      : 0
                  }
                />
              </div>
            ))
          ) : (
            <p className="text-slate-600">
              Belum ada student yang membeli kursus ini.
            </p>
          )}
        </div>
      </div>
    ))
  ) : (
    <p className="text-slate-600">Belum ada data student.</p>
  )}
</div>

          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-[1.4em] text-slate-900 border-b-2 border-blue-600 pb-2">
              Upcoming Appointment
            </h2>

            {!isCoach ? (
              studentUpcomingAppointments.length === 0 ? (
                <p className="text-slate-600 mt-4">No upcoming appointments.</p>
              ) : (
                studentUpcomingAppointments.map((app, idx) => (
                  <UpcomingClassCard
                    key={app.id || idx}
                    data={{
                      ...app,
                      onViewSession: () =>
                        alert(
                          `Lihat detail appointment dengan ${app.lecturer} pada ${app.time}`
                        ),
                    }}
                  />
                ))
              )
            ) : coachUpcomingClasses.length === 0 ? (
              <p className="text-slate-600 mt-4">No upcoming classes.</p>
            ) : (
              coachUpcomingClasses.map((cls, idx) => (
                <UpcomingClassCard
                  key={idx}
                  data={{
                    ...cls,
                    onViewSession: () =>
                      alert(`Lihat sesi ${cls.session} dari ${cls.title}`),
                    status: cls.status || "confirmed",
                  }}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
