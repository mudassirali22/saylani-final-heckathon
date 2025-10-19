
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {
  Calendar,
  Bot,
  AlertTriangle,
  MessageCircleQuestion,
  XCircle,
  CheckCircle,
  Home,
  Flag,
  UtensilsCrossed,
  Apple,
  Info
} from 'lucide-react';

const ReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${id}`);
      setReport(response.data.data);
    } catch (error) {
      console.error('Error fetching report:', error);
      alert('Failed to load report');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    setDeleting(true);
    try {
      await api.delete(`/reports/${id}`);
      alert('Report deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading report...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Report not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-green-600 hover:text-green-700 flex items-center"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{report.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {report.reportType}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-green-600" /> {formatDate(report.date)}
              </span>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Report Preview</h2>
          {report.fileUrl.toLowerCase().endsWith('.pdf') ? (
            <div className="border rounded-lg p-4">
              <iframe src={report.fileUrl} className="w-full h-96 rounded" title="Report PDF" />
              <a
                href={report.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-green-600 hover:text-green-700"
              >
                Open in new tab →
              </a>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <img src={report.fileUrl} alt="Report" className="w-full h-auto" />
            </div>
          )}
        </div>
      </div>

      {report.aiSummary && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bot className="w-6 h-6 text-green-700" /> AI Analysis
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-blue-600" /> English Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{report.aiSummary.english}</p>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Flag className="w-5 h-5 text-green-600" /> Roman Urdu Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">{report.aiSummary.urdu}</p>
              </div>
            </div>

            {report.aiSummary.abnormalValues?.length > 0 && (
              <div className="bg-red-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" /> Abnormal Values Found
                </h3>
                <ul className="space-y-2">
                  {report.aiSummary.abnormalValues.map((value, i) => (
                    <li key={i} className="text-red-800 flex items-start">
                      <span className="mr-2">•</span> {value}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {report.aiSummary.questionsForDoctor?.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <MessageCircleQuestion className="w-5 h-5 text-blue-600" /> Questions to Ask Your Doctor
                </h3>
                <ul className="space-y-2">
                  {report.aiSummary.questionsForDoctor.map((q, i) => (
                    <li key={i} className="text-blue-800 flex items-start">
                      <span className="mr-2">{i + 1}.</span> {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {report.aiSummary.foodsToAvoid?.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                    <UtensilsCrossed className="w-5 h-5 text-orange-600" /> Foods to Avoid
                  </h3>
                  <ul className="space-y-2">
                    {report.aiSummary.foodsToAvoid.map((f, i) => (
                      <li key={i} className="text-orange-800 flex items-start">
                        <span className="mr-2">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {report.aiSummary.foodsToEat?.length > 0 && (
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Apple className="w-5 h-5 text-green-600" /> Beneficial Foods
                  </h3>
                  <ul className="space-y-2">
                    {report.aiSummary.foodsToEat.map((f, i) => (
                      <li key={i} className="text-green-800 flex items-start">
                        <span className="mr-2">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {report.aiSummary.homeRemedies?.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-6 mt-6">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Home className="w-5 h-5 text-purple-600" /> Home Remedies
                </h3>
                <ul className="space-y-2">
                  {report.aiSummary.homeRemedies.map((r, i) => (
                    <li key={i} className="text-purple-800 flex items-start">
                      <span className="mr-2">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mt-6">
              <p className="text-sm text-yellow-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-yellow-600" /> <strong>Disclaimer:</strong>{' '}
                {report.aiSummary.disclaimer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportView;
