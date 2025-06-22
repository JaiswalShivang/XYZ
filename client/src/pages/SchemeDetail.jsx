import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiConnector } from '../services/apiConnector';
import { urls } from '../services/apiLinks';

const SchemeDetail = () => {
  const { id } = useParams();
  const [scheme, setScheme] = useState(null);
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
  const [eligibilityResult, setEligibilityResult] = useState(null);

  useEffect(() => {
    fetchSchemeDetail();
  }, [id]);

  const fetchSchemeDetail = async () => {
    try {
      const response = await apiConnector('GET', urls.GET_SCHEMES_URL);
      if (response.data.success) {
        const foundScheme = response.data.data.find(s => s._id === id);
        if (foundScheme) {
          setScheme(foundScheme);
        } else {
          toast.error('Scheme not found');
        }
      }
    } catch (error) {
      toast.error('Failed to fetch scheme details');
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = () => {
    if (!scheme) return;

    const userAge = parseInt(eligibilityForm.age);
    const schemeTags = scheme.tags.map(tag => tag.toLowerCase());
    
    let eligibilityScore = 0;
    let reasons = [];
    let positiveFactors = [];

    // Age check
    if (userAge >= 18 && userAge <= 65) {
      eligibilityScore += 20;
      positiveFactors.push('Age requirement met (18-65 years)');
    } else {
      reasons.push('Age requirement not met (must be 18-65 years)');
    }

    // Category check
    if (schemeTags.includes(eligibilityForm.category.toLowerCase())) {
      eligibilityScore += 30;
      positiveFactors.push('Category matches scheme requirements');
    } else {
      reasons.push('Category mismatch with scheme requirements');
    }

    // Income check
    const income = parseInt(eligibilityForm.familyincome);
    if (income < 500000) {
      eligibilityScore += 25;
      positiveFactors.push('Income within eligible range');
    } else {
      reasons.push('Income exceeds eligibility limit (₹5,00,000)');
    }

    // Education check
    if (eligibilityForm.educationalbackground.toLowerCase().includes('graduate')) {
      eligibilityScore += 25;
      positiveFactors.push('Educational background meets requirements');
    } else {
      reasons.push('Educational background requirement not met');
    }

    setEligibilityResult({
      score: eligibilityScore,
      eligible: eligibilityScore >= 70,
      reasons: reasons,
      positiveFactors: positiveFactors
    });
  };

  const handleEligibilitySubmit = (e) => {
    e.preventDefault();
    checkEligibility();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Scheme Not Found</h2>
          <p className="text-gray-600 mb-6">The scheme you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/schemes"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse All Schemes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              to="/schemes"
              className="text-blue-600 hover:text-blue-700 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{scheme.title}</h1>
              <p className="text-gray-600">{scheme.department}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Scheme Images */}
            {scheme.schemeimages && scheme.schemeimages.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-64 md:h-96">
                  <img
                    src={scheme.schemeimages[0]}
                    alt={scheme.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                      {scheme.department}
                    </span>
                  </div>
                </div>
                {scheme.schemeimages.length > 1 && (
                  <div className="p-4 flex space-x-2 overflow-x-auto">
                    {scheme.schemeimages.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${scheme.title} ${index + 2}`}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Scheme Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{scheme.description}</p>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{scheme.benefits}</p>
              </div>
            </div>

            {/* How to Apply */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Apply</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">{scheme.howtoapply}</p>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition duration-200"
                >
                  Apply Now
                  <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tags */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {scheme.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Eligibility Checker */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Check Your Eligibility</h3>
              <form onSubmit={handleEligibilitySubmit} className="space-y-4">
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
                  placeholder="Age"
                  value={eligibilityForm.age}
                  onChange={(e) => setEligibilityForm({...eligibilityForm, age: e.target.value})}
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
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Check Eligibility
                </button>
              </form>
            </div>

            {/* Eligibility Result */}
            {eligibilityResult && (
              <div className={`bg-white rounded-lg shadow-md p-6 ${
                eligibilityResult.eligible ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'
              }`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Result</h3>
                <div className="text-center mb-4">
                  <div className={`text-3xl font-bold mb-2 ${
                    eligibilityResult.eligible ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {eligibilityResult.score}%
                  </div>
                  <div className={`text-lg font-semibold ${
                    eligibilityResult.eligible ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {eligibilityResult.eligible ? 'Eligible' : 'Not Eligible'}
                  </div>
                </div>
                
                {eligibilityResult.positiveFactors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Positive Factors:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {eligibilityResult.positiveFactors.map((factor, index) => (
                        <li key={index}>• {factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {eligibilityResult.reasons.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-800 mb-2">❌ Issues:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {eligibilityResult.reasons.map((reason, index) => (
                        <li key={index}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-center transition duration-200"
                >
                  Apply Now
                </a>
                <Link
                  to="/schemes"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-center transition duration-200"
                >
                  Browse More Schemes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeDetail;