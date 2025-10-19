
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { FaHeart, FaRegFileAlt, FaCalendarAlt, FaLightbulb, FaChartBar } from "react-icons/fa"; 

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, vitalsRes] = await Promise.all([
        api.get('/reports'),
        api.get('/vitals')
      ]);
      setReports(reportsRes.data.data.slice(0, 5));
      setVitals(vitalsRes.data.data.slice(0, 5));
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Apni sehat ki journey ko track karen</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Reports */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Reports</p>
              <p className="text-3xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <FaRegFileAlt className="text-4xl text-green-600" /> 
          </div>
        </div>

        {/* Vitals */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Vital Records</p>
              <p className="text-3xl font-bold text-gray-900">{vitals.length}</p>
            </div>
            <FaHeart className="text-4xl text-green-600" />
          </div>
        </div>

        {/* Last Check */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Last Check</p>
              <p className="text-lg font-semibold text-gray-900">
                {reports[0] ? formatDate(reports[0].date) : 'N/A'}
              </p>
            </div>
            <FaCalendarAlt className="text-4xl text-green-600" /> 
          </div>
        </div>
      </div>

      {/* Reports & Vitals Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <Link
              to="/upload-report"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              + Add New
            </Link>
          </div>
          {reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No reports yet</p>
              <Link
                to="/upload-report"
                className="text-green-600 hover:text-green-700 mt-2 inline-block"
              >
                Upload your first report
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <Link
                  key={report._id}
                  to={`/report/${report._id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-600">{report.reportType}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(report.date)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Vitals</h2>
            <Link
              to="/add-vitals"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add New
            </Link>
          </div>
          {vitals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No vitals recorded yet</p>
              <Link
                to="/add-vitals"
                className="text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                Add your first vitals
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {vitals.map((vital) => (
                <div
                  key={vital._id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(vital.date)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {vital.bloodPressure?.systolic && (
                      <div>
                        <span className="text-gray-600">BP:</span>{' '}
                        <span className="font-medium">
                          {vital.bloodPressure.systolic}/{vital.bloodPressure.diastolic}
                        </span>
                      </div>
                    )}
                    {vital.bloodSugar && (
                      <div>
                        <span className="text-gray-600">Sugar:</span>{' '}
                        <span className="font-medium">{vital.bloodSugar}</span>
                      </div>
                    )}
                    {vital.weight && (
                      <div>
                        <span className="text-gray-600">Weight:</span>{' '}
                        <span className="font-medium">{vital.weight} kg</span>
                      </div>
                    )}
                    {vital.heartRate && (
                      <div>
                        <span className="text-gray-600">Heart Rate:</span>{' '}
                        <span className="font-medium">{vital.heartRate} bpm</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center gap-2">
          <FaLightbulb className="text-green-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Link
            to="/upload-report"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <FaRegFileAlt className="text-3xl mb-2 text-green-600" /> 
            <p className="font-medium text-gray-900">Upload Report</p>
            <p className="text-sm text-gray-600 mt-1">Add medical documents</p>
          </Link>
          <Link
            to="/add-vitals"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <FaHeart className="text-3xl mb-2 text-green-600" /> 
            <p className="font-medium text-gray-900">Add Vitals</p>
            <p className="text-sm text-gray-600 mt-1">Track BP, sugar, weight</p>
          </Link>
          <Link
            to="/timeline"
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition text-center"
          >
            <FaChartBar className="text-3xl mb-2 text-green-600" /> 
            <p className="font-medium text-gray-900">View Timeline</p>
            <p className="text-sm text-gray-600 mt-1">See complete history</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
