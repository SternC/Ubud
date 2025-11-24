// src/components/CoachAvailability.jsx
import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../api';

const CoachAvailability = () => {
  const [availabilities, setAvailabilities] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    maxStudents: 1,
    price: 0
  });

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const response = await availabilityAPI.getCoachAvailability();
      setAvailabilities(response.data.data);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await availabilityAPI.createAvailability(formData);
      setFormData({ date: '', startTime: '', endTime: '', maxStudents: 1, price: 0 });
      fetchAvailabilities();
      alert('Availability created successfully!');
    } catch (error) {
      console.error('Error creating availability:', error);
      alert('Error creating availability');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        await availabilityAPI.deleteAvailability(id);
        fetchAvailabilities();
        alert('Availability deleted successfully!');
      } catch (error) {
        console.error('Error deleting availability:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Availability</h2>
      
      {/* Create Availability Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({...formData, startTime: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({...formData, endTime: e.target.value})}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Max Students"
            value={formData.maxStudents}
            onChange={(e) => setFormData({...formData, maxStudents: e.target.value})}
            className="p-2 border rounded"
            min="1"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="p-2 border rounded"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Add Availability
        </button>
      </form>

      {/* Availability List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Your Availability Schedule</h3>
        <div className="grid gap-4">
          {availabilities.map((availability) => (
            <div key={availability.id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p><strong>Date:</strong> {availability.date}</p>
                <p><strong>Time:</strong> {availability.startTime} - {availability.endTime}</p>
                <p><strong>Max Students:</strong> {availability.maxStudents}</p>
                <p><strong>Price:</strong> ${availability.price}</p>
              </div>
              <button
                onClick={() => handleDelete(availability.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachAvailability;