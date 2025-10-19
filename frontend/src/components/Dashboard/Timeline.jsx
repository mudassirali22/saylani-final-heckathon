
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  FileText,
  HeartPulse,
  BarChart3
} from 'lucide-react';

const Timeline = () => {
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, reports, vitals

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, vitalsRes] = await Promise.all([
        api.get('/reports'),
        api.get('/vitals')
      ]);
      setReports(reportsRes.data.data);
      setVitals(vitalsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Combine and sort all records by date
  const getAllRecords = () => {
    const allRecords = [
      ...reports.map(r => ({ ...r, type: 'report' })),
      ...vitals.map(v => ({ ...v, type: 'vital' }))
    ];

    return allRecords
      .filter(record => {
        if (filter === 'reports') return record.type === 'report';
        if (filter === 'vitals') return record.type === 'vital';
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading timeline...</div>
      </div>
    );
  }

  const allRecords = getAllRecords();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Health Timeline</h1>
        <p className="text-gray-600 mt-2">
          Apni complete health journey ek jagah dekhen
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({reports.length + vitals.length})
            </button>
            <button
              onClick={() => setFilter('reports')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'reports'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reports ({reports.length})
            </button>
            <button
              onClick={() => setFilter('vitals')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'vitals'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Vitals ({vitals.length})
            </button>
          </div>

          <div className="flex gap-2">
            <Link
              to="/upload-report"
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
            >
              + Report
            </Link>
            <Link
              to="/add-vitals"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              + Vitals
            </Link>
          </div>
        </div>
      </div>

      {allRecords.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="flex justify-center mb-4">
            <BarChart3 className="w-16 h-16 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Records Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start tracking your health by adding reports or vitals
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/upload-report"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Upload Report
            </Link>
            <Link
              to="/add-vitals"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Add Vitals
            </Link>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>

          <div className="space-y-6">
            {allRecords.map((record) => (
              <div key={`${record.type}-${record._id}`} className="relative pl-16">
                {/* Timeline dot */}
                <div
                  className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
                    record.type === 'report' ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                ></div>

                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {record.type === 'report' ? (
                          <FileText className="w-6 h-6 text-green-600" />
                        ) : (
                          <HeartPulse className="w-6 h-6 text-blue-600" />
                        )}
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {record.type === 'report' ? record.title : 'Vital Signs'}
                        </h3>
                        <p className="text-sm text-gray-600">{formatDate(record.date)}</p>
                      </div>
                    </div>
                    {record.type === 'report' && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {record.reportType}
                      </span>
                    )}
                  </div>

                  {record.type === 'report' ? (
                    <div>
                      {record.aiSummary?.english && (
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {record.aiSummary.english}
                        </p>
                      )}
                      <Link
                        to={`/report/${record._id}`}
                        className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                      >
                        View Details →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {record.bloodPressure?.systolic && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-600 text-xs">Blood Pressure</p>
                          <p className="font-semibold text-gray-900">
                            {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                          </p>
                        </div>
                      )}
                      {record.bloodSugar && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-600 text-xs">Blood Sugar</p>
                          <p className="font-semibold text-gray-900">{record.bloodSugar} mg/dL</p>
                        </div>
                      )}
                      {record.weight && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-600 text-xs">Weight</p>
                          <p className="font-semibold text-gray-900">{record.weight} kg</p>
                        </div>
                      )}
                      {record.heartRate && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-600 text-xs">Heart Rate</p>
                          <p className="font-semibold text-gray-900">{record.heartRate} bpm</p>
                        </div>
                      )}
                      {record.temperature && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-600 text-xs">Temperature</p>
                          <p className="font-semibold text-gray-900">{record.temperature}°F</p>
                        </div>
                      )}
                      {record.notes && (
                        <div className="col-span-2 md:col-span-4 bg-gray-50 p-3 rounded">
                          <p className="text-gray-600 text-xs mb-1">Notes</p>
                          <p className="text-gray-900">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;
