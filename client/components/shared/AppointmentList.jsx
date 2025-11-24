// src/components/AppointmentList.jsx
import React, { useState, useEffect } from 'react';
import { appointmentAPI } from '../api';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    fetchAppointments();
    const user = JSON.parse(localStorage.getItem('user'));
    setUserRole(user?.role || '');
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentAPI.getMyAppointments();
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status, meetingLink = '') => {
    try {
      await appointmentAPI.updateAppointmentStatus(appointmentId, {
        status,
        meetingLink
      });
      fetchAppointments();
      alert('Appointment status updated!');
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Appointments</h2>
      
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p>
                  <strong>
                    {userRole === 'student' ? 'Coach: ' : 'Student: '}
                  </strong>
                  {userRole === 'student' 
                    ? appointment.Coach?.name 
                    : appointment.Student?.name
                  }
                </p>
                <p><strong>Course:</strong> {appointment.Course?.title}</p>
                <p><strong>Date & Time:</strong> {new Date(appointment.appointmentDate).toLocaleString()}</p>
                <p><strong>Duration:</strong> 1 hour</p>
                <span className={`px-2 py-1 rounded text-sm ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
                {appointment.meetingLink && (
                  <p>
                    <strong>Meeting Link:</strong>{' '}
                    <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                      Join Meeting
                    </a>
                  </p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {userRole === 'coach' && appointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
                
                {userRole === 'coach' && appointment.status === 'confirmed' && (
                  <button
                    onClick={() => {
                      const meetingLink = prompt('Enter meeting link:');
                      if (meetingLink) {
                        updateAppointmentStatus(appointment.id, 'confirmed', meetingLink);
                      }
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Meeting Link
                  </button>
                )}
                
                {(userRole === 'student' && appointment.status === 'pending') && (
                  <button
                    onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;