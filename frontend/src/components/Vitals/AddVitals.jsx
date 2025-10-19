import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AddVitals = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    systolic: '',
    diastolic: '',
    bloodSugar: '',
    weight: '',
    temperature: '',
    heartRate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate at least one vital is entered
    if (!formData.systolic && !formData.bloodSugar && !formData.weight && 
        !formData.temperature && !formData.heartRate) {
      setError('Please enter at least one vital sign');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = {
        date: formData.date,
        notes: formData.notes
      };

      // Add blood pressure if both values are provided
      if (formData.systolic && formData.diastolic) {
        dataToSend.bloodPressure = {
          systolic: parseFloat(formData.systolic),
          diastolic: parseFloat(formData.diastolic)
        };
      }

      // Add other vitals if provided
      if (formData.bloodSugar) dataToSend.bloodSugar = parseFloat(formData.bloodSugar);
      if (formData.weight) dataToSend.weight = parseFloat(formData.weight);
      if (formData.temperature) dataToSend.temperature = parseFloat(formData.temperature);
      if (formData.heartRate) dataToSend.heartRate = parseFloat(formData.heartRate);

      await api.post('/vitals', dataToSend);
      
      setSuccess('Vital signs added successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add vital signs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Add Vital Signs</h1>
        <p className="text-gray-600 mb-6">Apne daily vitals record karen</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Blood Pressure</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="systolic" className="block text-sm font-medium text-gray-700 mb-2">
                  Systolic (Upper) - mmHg
                </label>
                <input
                  type="number"
                  id="systolic"
                  name="systolic"
                  value={formData.systolic}
                  onChange={handleChange}
                  placeholder="e.g., 120"
                  min="0"
                  max="300"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="diastolic" className="block text-sm font-medium text-gray-700 mb-2">
                  Diastolic (Lower) - mmHg
                </label>
                <input
                  type="number"
                  id="diastolic"
                  name="diastolic"
                  value={formData.diastolic}
                  onChange={handleChange}
                  placeholder="e.g., 80"
                  min="0"
                  max="200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Normal range: 90/60 to 120/80 mmHg
            </p>
          </div>

          <div>
            <label htmlFor="bloodSugar" className="block text-sm font-medium text-gray-700 mb-2">
              Blood Sugar - mg/dL
            </label>
            <input
              type="number"
              id="bloodSugar"
              name="bloodSugar"
              value={formData.bloodSugar}
              onChange={handleChange}
              placeholder="e.g., 95"
              min="0"
              max="600"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Fasting normal range: 70-100 mg/dL
            </p>
          </div>

          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
              Weight - kg
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g., 70"
              min="0"
              max="300"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
              Temperature - °F
            </label>
            <input
              type="number"
              id="temperature"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="e.g., 98.6"
              min="90"
              max="110"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Normal range: 97-99°F (36.1-37.2°C)
            </p>
          </div>

          <div>
            <label htmlFor="heartRate" className="block text-sm font-medium text-gray-700 mb-2">
              Heart Rate - bpm
            </label>
            <input
              type="number"
              id="heartRate"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleChange}
              placeholder="e.g., 72"
              min="30"
              max="200"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Normal resting range: 60-100 bpm
            </p>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional notes about how you're feeling..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">💡 Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Measure BP in the morning before eating</li>
              <li>• Check blood sugar as per your doctor's advice</li>
              <li>• Weigh yourself at the same time each day</li>
              <li>• Record any symptoms in notes</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Saving...' : 'Save Vitals'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVitals;