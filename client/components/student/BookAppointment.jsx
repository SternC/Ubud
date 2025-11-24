// src/components/BookAppointment.jsx
import React, { useState, useEffect } from 'react';
import { appointmentAPI, availabilityAPI, purchaseAPI } from '../api';

const BookAppointment = ({ coachId, courseId }) => {
  const [availabilities, setAvailabilities] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAvailabilities();
    fetchMyPurchases();
  }, [coachId]);

  const fetchAvailabilities = async () => {
    try {
      const response = await availabilityAPI.getCoachAvailability(coachId);
      setAvailabilities(response.data.data);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const fetchMyPurchases = async () => {
    try {
      const response = await purchaseAPI.getMyPurchases();
      setPurchases(response.data.data);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedAvailability) {
      alert('Please select an available time slot');
      return;
    }

    // Check if student has purchased a course from this coach
    const hasPurchased = purchases.some(
      purchase => 
        purchase.courseId === courseId && 
        purchase.status === 'completed' &&
        purchase.Course.coachId === coachId
    );

    if (!hasPurchased) {
      alert('You need to purchase a course from this coach first!');
      return;
    }

    try {
      await appointmentAPI.createAppointment({
        availabilityId: selectedAvailability.id,
        courseId: courseId,
        notes: notes
      });
      alert('Appointment booked successfully!');
      setSelectedAvailability(null);
      setNotes('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert(error.response?.data?.message || 'Error booking appointment');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Book Appointment</h2>
      
      {/* Availability List */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
        <div className="grid gap-4">
          {availabilities
            .filter(avail => avail.isAvailable)
            .map((availability) => (
              <div
                key={availability.id}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedAvailability?.id === availability.id 
                    ? 'bg-blue-100 border-blue-500' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAvailability(availability)}
              >
                <p><strong>Date:</strong> {availability.date}</p>
                <p><strong>Time:</strong> {availability.startTime} - {availability.endTime}</p>
                <p><strong>Price:</strong> ${availability.price}</p>
                <p><strong>Slots Available:</strong> {availability.maxStudents}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Booking Form */}
      {selectedAvailability && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Confirm Appointment</h3>
          <div className="mb-4">
            <p><strong>Selected Time:</strong> {selectedAvailability.date} at {selectedAvailability.startTime}</p>
            <p><strong>Duration:</strong> 1 hour</p>
            <p><strong>Price:</strong> ${selectedAvailability.price}</p>
          </div>
          <textarea
            placeholder="Additional notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            rows="3"
          />
          <button
            onClick={handleBookAppointment}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Confirm Booking
          </button>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;