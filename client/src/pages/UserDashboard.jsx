import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { apiConnector } from '../services/apiConnector';
import { urls } from '../services/apiLinks';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eligibilityForm, setEligibilityForm] = useState({
    state: '',
    city: '',
    category: '',
    gender: '',
    familyincome: '',
    age: '',
    educationalbackground: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schemesResponse, feedbacksResponse] = await Promise.all([
        apiConnector('GET', urls.GET_SCHEMES_URL),
        apiConnector('GET', urls.GET_ALL_FEEDBACK_URL)
      ]);

      if (schemesResponse.data.success) {
        setSchemes(schemesResponse.data.data);
      }
      if (feedbacksResponse.data.success) {
        setFeedbacks(feedbacksResponse.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Submit Feedback
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Eligibility Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Check Your Eligibility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="State"
              value={eligibilityForm.state}
              onChange={(e) => setEligibilityForm({...eligibilityForm, state: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="City"
              value={eligibilityForm.city}
              onChange={(e) => setEligibilityForm({...eligibilityForm, city: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={eligibilityForm.category}
              onChange={(e) => setEligibilityForm({...eligibilityForm, category: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="General">General</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="OBC">OBC</option>
              <option value="EWS">EWS</option>
            </select>
            <select
              value={eligibilityForm.gender}
              onChange={(e) => setEligibilityForm({...eligibilityForm, gender: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              placeholder="Family Income (₹)"
              value={eligibilityForm.familyincome}
              onChange={(e) => setEligibilityForm({...eligibilityForm, familyincome: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Age"
              value={eligibilityForm.age}
              onChange={(e) => setEligibilityForm({...eligibilityForm, age: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Educational Background"
              value={eligibilityForm.educationalbackground}
              onChange={(e) => setEligibilityForm({...eligibilityForm, educationalbackground: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Schemes Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Schemes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes && schemes.length > 0 ? schemes.map((scheme) => {
              if (!scheme || !scheme._id) {
                return null; // Skip invalid schemes
              }
              
              return (
                <div key={scheme._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                  {scheme.schemeimages && scheme.schemeimages.length > 0 && (
                    <img
                      src={scheme.schemeimages[0]}
                      alt={scheme.title || 'Scheme Image'}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.title || 'Untitled Scheme'}</h3>
                    <p className="text-gray-600 text-sm mb-2">{scheme.department || 'No Department'}</p>
                    <p className="text-gray-700 mb-4 line-clamp-3">{scheme.description || 'No description available'}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {scheme.tags && scheme.tags.length > 0 ? scheme.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      )) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          No tags
                        </span>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={`/schemes/${scheme._id}`}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm text-center transition duration-200"
                      >
                        View Details
                      </Link>
                      {scheme.link && (
                        <a
                          href={scheme.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm text-center transition duration-200"
                        >
                          Apply Now
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No schemes available</h3>
                <p className="mt-1 text-sm text-gray-500">Check back later for new government schemes.</p>
              </div>
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Feedback</h2>
          <div className="space-y-4">
            {feedbacks && feedbacks.length > 0 ? feedbacks.filter(feedback => feedback && feedback.user && feedback.user._id === user?.id).map((feedback) => (
              <div key={feedback._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                <div>
                  <p className="text-gray-700">{feedback.message || 'No message'}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : 'Unknown date'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No feedback yet</h3>
                <p className="mt-1 text-sm text-gray-500">Submit your first feedback to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;