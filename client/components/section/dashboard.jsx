import React from 'react';

// Data dummy untuk simulasi progress pembelajaran (TETAP SAMA)
const coursesData = [
  { id: 1, title: 'Pengenalan React dan Komponen', code: 'REACT101', progress: 75, status: 'In Progress' },
  { id: 2, title: 'Styling dalam React (Tailwind CSS)', code: 'CSS202', progress: 30, status: 'Not Started' },
  { id: 3, title: 'Manajemen State dengan Redux/Context', code: 'STATE303', progress: 100, status: 'Completed' },
];

// Data dummy untuk 'Upcoming Class'
const upcomingClass = {
  title: 'React Hooks & State Management',
  course: 'REACT101',
  lecturer: 'Dr. Ahmad Fauzi, S.Kom., M.T.',
  time: 'Hari Ini, 09:00 - 10:30 WIB',
  session: 5,
  courseProgress: 3, // Global course progress percentage
};

// Komponen Bar Chart Horizontal untuk Progress
const ProgressChartBar = ({ title, code, progress }) => {
  // Styling modern untuk bar
  const containerStyle = {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  };

  const barWrapperStyle = {
    height: '15px',
    backgroundColor: '#e9ecef', // Light grey background
    borderRadius: '4px',
    marginTop: '4px',
    overflow: 'hidden',
  };

  const barFillStyle = {
    height: '100%',
    width: `${progress}%`,
    backgroundColor: progress === 100 ? '#28a745' : '#007bff', // Green for 100%, Blue otherwise
    borderRadius: '4px',
    transition: 'width 0.5s ease-in-out',
  };

  return (
    <div style={containerStyle}>
      <p style={{ fontSize: '0.95em', margin: 0, color: '#333' }}>
        {title} <span style={{ color: '#6c757d', fontSize: '0.85em' }}>({code})</span>
      </p>
      <div style={barWrapperStyle}>
        <div style={barFillStyle}></div>
      </div>
      <p style={{ fontSize: '0.85em', color: '#007bff', textAlign: 'right', marginTop: '3px' }}>
        {progress}% Complete
      </p>
    </div>
  );
};

// Komponen Upcoming Class Card
const UpcomingClassCard = ({ classData }) => {
  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <span style={{ backgroundColor: '#007bff', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em' }}>
          Online Class
        </span>
        <span style={{ color: '#6c757d', fontSize: '0.9em' }}>
          ⏳ 1h 30m
        </span>
      </div>

      <h3 style={{ fontSize: '1.4em', fontWeight: 'bold', margin: '0 0 5px 0', color: '#0b2a45' }}>
        {classData.title}
      </h3>
      <p style={{ fontSize: '1em', color: '#495057', marginBottom: '10px' }}>
        {classData.lecturer}
      </p>

      <div style={{ fontSize: '0.9em', color: '#6c757d', marginBottom: '15px' }}>
        <p style={{ margin: '3px 0' }}>🗓️ {classData.time}</p>
        <p style={{ margin: '3px 0' }}>📚 Course: {classData.course}</p>
      </div>

      <button style={{
        width: '100%',
        padding: '12px',
        backgroundColor: '#dc3545', // Warna Merah untuk Action Button
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
      }}>
        View things to do in session {classData.session} &rarr;
      </button>

      <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
        <p style={{ fontSize: '0.9em', color: '#495057', margin: 0 }}>
          Course Progress: **{classData.courseProgress}%**
        </p>
      </div>
    </div>
  );
};


// Komponen Utama Dashboard (HANYA KONTEN)
const Dashboard = () => {
  
  const layoutStyle = {
    display: 'grid',
    // Membagi layout menjadi dua kolom utama (Progress dan Upcoming Class)
    gridTemplateColumns: '2fr 1fr', 
    gap: '30px',
    marginTop: '20px',
  };

  const sectionStyle = {
    padding: '25px',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #eee', // Border halus
  };

  return (
    <div className="dashboard-content">
      {/* Container untuk Progress dan Upcoming Class */}
      <div style={layoutStyle}>

        {/* KOLOM 1: My Progress */}
        <div style={sectionStyle}>
          <h2 style={{ fontSize: '1.5em', borderBottom: '2px solid #007bff', paddingBottom: '10px', marginBottom: '20px', color: '#0b2a45' }}>
            My Progress
          </h2>
          
          {/* Filter Bar (Placeholder) */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
             <select style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option>2025, Odd Semester</option>
             </select>
             <select style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
                <option>All Sessions</option>
             </select>
          </div>

          {/* Progress Chart */}
          <div style={{ paddingRight: '20px' }}>
            {coursesData.map(course => (
              <ProgressChartBar
                key={course.id}
                title={course.title}
                code={course.code}
                progress={course.progress}
              />
            ))}
          </div>

          <p style={{ fontSize: '0.9em', textAlign: 'right', marginTop: '20px', color: '#6c757d' }}>
              **<span style={{ color: '#007bff' }}>Progress Kursus</span>** | **<span style={{ color: '#28a745' }}>Progress Anda</span>**
          </p>
        </div>

        {/* KOLOM 2: Upcoming Class */}
        <div>
          <h2 style={{ fontSize: '1.5em', borderBottom: '2px solid #dc3545', paddingBottom: '10px', marginBottom: '20px', color: '#0b2a45' }}>
            Upcoming Class
          </h2>
          <UpcomingClassCard classData={upcomingClass} />
        </div>

      </div>

      {/* Area Bawah (Information, To Do List, Latest Forum) - Placeholder */}
       <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
          <div style={sectionStyle}><h3 style={{color: '#0b2a45'}}>Information</h3><p style={{color: '#6c757d'}}>Konten Informasi di sini...</p></div>
          <div style={sectionStyle}><h3 style={{color: '#0b2a45'}}>To Do List</h3><p style={{color: '#6c757d'}}>Konten To Do List di sini...</p></div>
          <div style={sectionStyle}><h3 style={{color: '#0b2a45'}}>Latest Forum</h3><p style={{color: '#6c757d'}}>Konten Forum di sini...</p></div>
       </div>
       
    </div>
  );
};

export default Dashboard;