import React from 'react';
import { Link } from 'react-router-dom';

const SchemeCard = ({ scheme, isEligible }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{scheme.title}</h3>
          {isEligible && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Eligible
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2">Department: {scheme.department}</p>
        <p className="text-gray-700 mb-4 line-clamp-3">{scheme.description}</p>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Benefits:</h4>
          <p className="text-sm text-gray-600">{scheme.benefits}</p>
        </div>

        <div className="flex justify-between items-center">
          <Link 
            to={`/schemes/${scheme._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Details
          </Link>
          {isEligible && (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
              onClick={() => window.location.href = scheme.applicationUrl}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;