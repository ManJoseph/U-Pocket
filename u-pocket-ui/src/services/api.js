const API_BASE_URL = '/api';

async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const responseText = await response.text();
  
  let errorData;
  if (isJson) {
    try {
      errorData = JSON.parse(responseText);
    } catch {
      errorData = responseText;
    }
  } else {
    errorData = responseText;
  }

  if (!response.ok) {
    // Stringify if it's an object to prevent [object Object]
    const errorMessage = typeof errorData === 'object' 
      ? JSON.stringify(errorData) 
      : errorData;

    throw new Error(errorMessage || 'An unexpected error occurred');
  }

  // Return the parsed data for successful requests
  return typeof errorData === 'string' ? JSON.parse(errorData) : errorData;
}

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    return handleResponse(response);
  },
  post: async (endpoint, data) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};
