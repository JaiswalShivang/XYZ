const BASE_URL = 'http://localhost:3000/api';

export const urls = {
  // Authentication APIs
  LOGIN_URL: `${BASE_URL}/login`,
  SIGNUP_URL: `${BASE_URL}/signup`,
  TEST_AUTH_URL: `${BASE_URL}/testAuth`,

  // Scheme APIs
  GET_SCHEMES_URL: `${BASE_URL}/getScheme`,
  CREATE_SCHEME_URL: `${BASE_URL}/createScheme`,
  UPDATE_SCHEME_URL: (id) => `${BASE_URL}/updateScheme/${id}`,
  DELETE_SCHEME_URL: (id) => `${BASE_URL}/deleteScheme/${id}`,

  // Eligibility APIs
  CREATE_ELIGIBILITY_URL: `${BASE_URL}/createEligibility`,

  // Feedback APIs
  CREATE_FEEDBACK_URL: `${BASE_URL}/createFeedback`,
  GET_ALL_FEEDBACK_URL: `${BASE_URL}/getallFeedback`,

  // Additional Details APIs
  ADD_DETAILS_URL: `${BASE_URL}/addDetails`,
}