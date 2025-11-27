import React, { useState, useMemo, useEffect } from 'react';
import api from '../../src/api.jsx';

const coursesData = [
  { id: 1, title: 'Pengenalan React dan Komponen', code: 'REACT101', progress: 75, status: 'In Progress', date: '2025-02-10' },
  { id: 2, title: 'Styling dalam React (Tailwind CSS)', code: 'CSS202', progress: 30, status: 'Not Started', date: '2025-04-05' },
  { id: 3, title: 'Manajemen State dengan Redux/Context', code: 'STATE303', progress: 100, status: 'Completed', date: '2025-06-20' },
  { id: 4, title: 'Integrasi API dan Fetch Data', code: 'API404', progress: 50, status: 'In Progress', date: '2025-06-21' },
];

const upcomingClass = {
  title: 'React Hooks & State Management',
  course: 'REACT101',
  lecturer: 'Dr. Ahmad Fauzi, S.Kom., M.T.',
  time: 'Hari Ini, 09:00 - 10:30 WIB',
  session: 5,
  courseProgress: 3,
};

const timelineData = [
  { date: "Tuesday, 21 October", course: "IF451 - Advanced Web Programming - LAB", time: "09:00" },
  { date: "Thursday, 23 October", course: "UM142 - Indonesian Language - LEC", time: "09:00" },
];

const mockCoachTimeline = [
  { date: 'Monday, 20 October', course: 'REACT101 - Hooks Lab', submissions: 5 },
  { date: 'Wednesday, 22 October', course: 'NODE301 - API Assignment', submissions: 3 }
];

const ProgressBar = ({ title, code, progress }) => (
  <div className="mb-5">
    <p className="text-[0.95em] mb-1 text-slate-900">
      {title}{' '}
      <span className="text-gray-500 text-[0.85em]">
        ({code})
      </span>
    </p>
    <div className="h-2 bg-gray-200 rounded-md overflow-hidden">
      <div
        className={`h-full rounded-md transition-all duration-400 ease-in-out ${progress === 100 ? 'bg-blue-700' : 'bg-blue-500'}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <p className="text-right text-[0.85em] text-slate-700 mt-1">{progress}%</p>
  </div>
);

const UpcomingClassCard = ({ data }) => (
  <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 shadow-md shadow-black/5 mb-4">
    <h3 className="text-[1.2em] font-semibold text-slate-900 mb-1.5">{data.title}</h3>
    <p className="text-slate-600 text-[0.95em] mb-2">{data.lecturer}</p>
    <p className="text-gray-500 text-[0.9em] my-1">{data.time}</p>
    <p className="text-gray-500 text-[0.9em] mb-4">Course: {data.course}</p>
    <button
      onClick={data.onViewSession ? data.onViewSession : null}
      className="w-full py-2.5 bg-blue-700 text-white rounded-lg font-medium cursor-pointer transition-colors duration-300 hover:bg-blue-800"
    >
      Lihat Kegiatan Sesi {data.session}
    </button>
    <p className="mt-2.5 text-slate-700 text-[0.9em]">
      Progress Kursus:{' '}
      <span className="text-blue-600 font-semibold">{data.courseProgress}%</span>
    </p>
  </div>
);

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedDay, setSelectedDay] = useState('All');
  const [isCoach, setIsCoach] = useState(false);
  const [studentProgress, setStudentProgress] = useState([]);
  const [coachUpcomingClasses, setCoachUpcomingClasses] = useState([]);
  const [coachTimeline, setCoachTimeline] = useState([]);

  useEffect(() => {
    api.get("/profile")
      .then((res) => {
        setIsCoach(res.data.is_coach);
        if (res.data.is_coach) {
          api.get("/students-progress")
            .then((resp) => setStudentProgress(resp.data))
            .catch(() => setStudentProgress([]));

          api.get("/upcoming-classes")
            .then((resp) => setCoachUpcomingClasses(resp.data))
            .catch(() => setCoachUpcomingClasses([]));

          api.get("/timeline")
            .then((resp) => setCoachTimeline(resp.data))
            .catch(() => setCoachTimeline([]));
        }
      })
      .catch(() => setIsCoach(false));
  }, []);

  const availableYears = [...new Set(coursesData.map((c) => new Date(c.date).getFullYear().toString()))];
  const months = ['All', ...Array.from({ length: 12 }, (_, i) => new Date(0, i).toLocaleString('id', { month: 'long' }))];
  const availableDays = ['All', ...Array.from({ length: 31 }, (_, i) => (i + 1).toString())];

  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => {
      const courseDate = new Date(course.date);
      const year = courseDate.getFullYear().toString();
      const month = courseDate.toLocaleString('id', { month: 'long' });
      const day = courseDate.getDate().toString();
      const matchYear = selectedYear === 'All' || year === selectedYear;
      const matchMonth = selectedMonth === 'All' || month === selectedMonth;
      const matchDay = selectedDay === 'All' || day === selectedDay;
      return matchYear && matchMonth && matchDay;
    });
  }, [selectedYear, selectedMonth, selectedDay]);

  const avgProgress = filteredCourses.length
    ? Math.round(filteredCourses.reduce((a, b) => a + b.progress, 0) / filteredCourses.length)
    : 0;

  const handleEditDeadline = (item) => {
    alert(`Edit deadline untuk ${item.course} pada ${item.date}`);
  };

  const handleGiveTask = (item) => {
    alert(`Beri tugas untuk ${item.course} pada ${item.date}`);
  };

  const handleViewSession = (cls) => {
    alert(`Lihat kegiatan sesi ${cls.session} dari kelas ${cls.title}`);
  };

  return (
    <div className="p-6 bg-slate-50 min-h-[85vh]">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
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
                    setSelectedMonth('All');
                    setSelectedDay('All');
                  }}
                  className="p-2 rounded-md border border-slate-300 text-slate-700"
                >
                  <option>All</option>
                  {availableYears.map((year) => (
                    <option key={year}>{year}</option>
                  ))}
                </select>

                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value);
                    setSelectedDay('All');
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

              {filteredCourses.map((c) => (
                <ProgressBar key={c.id} title={c.title} code={c.code} progress={c.progress} />
              ))}

              <p className="text-right text-sm text-slate-600 mt-4">
                Rata-rata progress: <span className="text-blue-600 font-semibold">{avgProgress}%</span>
              </p>
            </>
          ) : (
            <div className="mt-5 space-y-4">
              {studentProgress.length === 0 ? (
                <p className="text-slate-600">Belum ada data student yang tersedia.</p>
              ) : (
                studentProgress.map((student, i) => (
                  <div key={i} className="border p-3 rounded-lg bg-slate-50">
                    <p className="font-semibold text-slate-900">{student.name}</p>
                    <p className="text-sm text-gray-600 mb-1">{student.course}</p>
                    <ProgressBar title="Progress" code={student.code} progress={student.progress} />
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-[1.4em] text-slate-900 border-b-2 border-blue-600 pb-2">
              Upcoming Class
            </h2>
            <UpcomingClassCard
              data={{ ...upcomingClass, onViewSession: () => handleViewSession(upcomingClass) }}
            />
            {isCoach && coachUpcomingClasses.map((cls, idx) => (
              <UpcomingClassCard
                key={idx}
                data={{ ...cls, onViewSession: () => handleViewSession(cls) }}
              />
            ))}
          </div>

            
          <div>
            <h2 className="text-[1.4em] text-slate-900 border-b-2 border-blue-600 pb-2 mb-4">
              Timeline
            </h2>
            <div className="space-y-4">
              {!isCoach && timelineData.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-4 pb-3 ml-1">
                  <p className="text-slate-800 font-semibold">{item.date}</p>
                  <p className="text-slate-600 text-sm mb-2">{item.course}</p>
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Add Submission
                  </button>
                </div>
              ))}

                {isCoach && (coachTimeline.length ? coachTimeline : mockCoachTimeline).map((item, idx) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4 pb-3 ml-1 flex flex-col gap-2 bg-slate-50 rounded-md p-2">
                    <div>
                      <p className="text-slate-800 font-semibold">{item.date}</p>
                      <p className="text-slate-600 text-sm mb-1">{item.course}</p>
                      <p className="text-sm text-gray-700">Submissions: {item.submissions}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditDeadline(item)}
                        className="px-3 py-1 bg-green-700 text-white text-sm rounded-md hover:bg-green-700 transition-colors duration-200"
                      >
                        Edit Deadline
                      </button>
                      <button
                        onClick={() => handleGiveTask(item)}
                        className="px-3 py-1 bg-blue-800 text-white text-sm rounded-md hover:bg-purple-700 transition-colors duration-200"
                      >
                        Beri Tugas
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}