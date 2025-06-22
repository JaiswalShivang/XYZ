import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { apiConnector, apiConnectorWithFiles } from '../services/apiConnector';
import { urls } from '../services/apiLinks';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [editingScheme, setEditingScheme] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    benefits: '',
    howtoapply: '',
    link: '',
    tags: ''
  });
  const [eligibilityForm, setEligibilityForm] = useState({
    schemeId: '',
    state: '',
    city: '',
    category: '',
    gender: '',
    familyincome: '',
    agelimit: '',
    educationalbackground: ''
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const response = await apiConnector('GET', urls.GET_SCHEMES_URL);
      if (response.data.success) {
        setSchemes(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch schemes');
    } finally {
      setLoading(false);
    }
  };

  // Test authentication function
  const testAuth = async () => {
    try {
      const response = await apiConnector('GET', urls.TEST_AUTH_URL);
      console.log('Auth test response:', response.data);
      toast.success('Authentication is working!');
    } catch (error) {
      console.error('Auth test error:', error);
      toast.error('Authentication failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateScheme = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, formData[key].split(',').map(tag => tag.trim()));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      selectedFiles.forEach(file => {
        formDataToSend.append('schemeimage', file);
      });

      const response = await apiConnectorWithFiles('POST', urls.CREATE_SCHEME_URL, formDataToSend);
      if (response.data.success) {
        toast.success('Scheme created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchSchemes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create scheme');
    }
  };

  const handleEditScheme = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          formDataToSend.append(key, formData[key].split(',').map(tag => tag.trim()));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      selectedFiles.forEach(file => {
        formDataToSend.append('schemeimage', file);
      });

      const response = await apiConnectorWithFiles('PUT', urls.UPDATE_SCHEME_URL(editingScheme._id), formDataToSend);
      if (response.data.success) {
        toast.success('Scheme updated successfully!');
        setShowEditModal(false);
        setEditingScheme(null);
        resetForm();
        fetchSchemes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update scheme');
    }
  };

  const handleCreateEligibility = async (e) => {
    e.preventDefault();
    try {
      const response = await apiConnector('POST', urls.CREATE_ELIGIBILITY_URL, eligibilityForm);
      if (response.data.success) {
        toast.success('Eligibility criteria created successfully!');
        setShowEligibilityModal(false);
        resetEligibilityForm();
        fetchSchemes();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create eligibility criteria');
    }
  };

  const handleDeleteScheme = async (schemeId) => {
    if (window.confirm('Are you sure you want to delete this scheme? This action cannot be undone.')) {
      try {
        const response = await apiConnector('DELETE', urls.DELETE_SCHEME_URL(schemeId));
        if (response.data && response.data.success) {
          toast.success('Scheme deleted successfully!');
          setSchemes(prev => prev.filter(s => s._id !== schemeId));
        } else {
          toast.error(response.data?.message || 'Failed to delete scheme');
        }
      } catch (error) {
        toast.error('Failed to delete scheme. Please try again.');
      }
    }
  };

  const openEditModal = (scheme) => {
    setEditingScheme(scheme);
    setFormData({
      title: scheme.title,
      description: scheme.description,
      department: scheme.department,
      benefits: scheme.benefits,
      howtoapply: scheme.howtoapply,
      link: scheme.link,
      tags: scheme.tags.join(', ')
    });
    setShowEditModal(true);
  };

  const openEligibilityModal = (scheme) => {
    setSelectedScheme(scheme);
    setEligibilityForm({
      schemeId: scheme._id,
      state: '',
      city: '',
      category: '',
      gender: '',
      familyincome: '',
      agelimit: '',
      educationalbackground: ''
    });
    setShowEligibilityModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      department: '',
      benefits: '',
      howtoapply: '',
      link: '',
      tags: ''
    });
    setSelectedFiles([]);
  };

  const resetEligibilityForm = () => {
    setEligibilityForm({
      schemeId: '',
      state: '',
      city: '',
      category: '',
      gender: '',
      familyincome: '',
      agelimit: '',
      educationalbackground: ''
    });
    setSelectedScheme(null);
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
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
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={testAuth}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Test Auth
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                Create Scheme
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div key={scheme._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
              {scheme.schemeimages && scheme.schemeimages.length > 0 && (
                <img
                  src={scheme.schemeimages[0]}
                  alt={scheme.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{scheme.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{scheme.department}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{scheme.description}</p>
                
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

                {/* Eligibility Status */}
                <div className="mb-4">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    scheme.eligibility 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      scheme.eligibility ? 'bg-green-400' : 'bg-yellow-400'
                    }`}></span>
                    {scheme.eligibility ? 'Eligibility Set' : 'No Eligibility Criteria'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEditModal(scheme)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openEligibilityModal(scheme)}
                    className={`px-3 py-2 rounded text-sm transition duration-200 ${
                      scheme.eligibility 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                  >
                    {scheme.eligibility ? 'Update Eligibility' : 'Set Eligibility'}
                  </button>
                  <button
                    onClick={() => handleDeleteScheme(scheme._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm transition duration-200"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => window.open(scheme.link, '_blank')}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm transition duration-200"
                  >
                    View Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {schemes.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No schemes</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new scheme.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Scheme
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Scheme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Scheme</h3>
              <form onSubmit={handleCreateScheme} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <textarea
                  placeholder="How to Apply"
                  value={formData.howtoapply}
                  onChange={(e) => setFormData({...formData, howtoapply: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <input
                  type="url"
                  placeholder="Application Link"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Scheme Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Scheme</h3>
              <form onSubmit={handleEditScheme} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <input
                  type="text"
                  placeholder="Department"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <textarea
                  placeholder="Benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <textarea
                  placeholder="How to Apply"
                  value={formData.howtoapply}
                  onChange={(e) => setFormData({...formData, howtoapply: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                />
                <input
                  type="url"
                  placeholder="Application Link"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingScheme(null);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Eligibility Modal */}
      {showEligibilityModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedScheme?.eligibility ? 'Update Eligibility Criteria' : 'Set Eligibility Criteria'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Scheme: <span className="font-medium">{selectedScheme?.title}</span>
              </p>
              <form onSubmit={handleCreateEligibility} className="space-y-4">
                <input
                  type="text"
                  placeholder="State"
                  value={eligibilityForm.state}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, state: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={eligibilityForm.city}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, city: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={eligibilityForm.category}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="All">All</option>
                </select>
                <input
                  type="number"
                  placeholder="Family Income (₹)"
                  value={eligibilityForm.familyincome}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, familyincome: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Age Limit"
                  value={eligibilityForm.agelimit}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, agelimit: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Educational Background"
                  value={eligibilityForm.educationalbackground}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, educationalbackground: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    {selectedScheme?.eligibility ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEligibilityModal(false);
                      resetEligibilityForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;