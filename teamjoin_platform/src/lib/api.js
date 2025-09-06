const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Login failed");
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access_token);
  return data;
};

export const signup = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Signup failed");
  }

  return response.json();
};

export const fetchUserProfile = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch user profile");
  }

  return response.json();
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_BASE_URL}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to update user profile");
  }

  return response.json();
};

export const fetchUserIdeas = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_BASE_URL}/user/ideas`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch user ideas");
  }

  return response.json();
};

export const fetchUserTeams = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_BASE_URL}/user/teams`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch user teams");
  }

  return response.json();
};

export const fetchFeed = async () => {
  const response = await fetch(`${API_BASE_URL}/feed/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch feed");
  }

  return response.json();
};

export const requestToJoinIdea = async (ideaId) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to request to join idea");
  }

  return response.json();
};

export const createIdea = async (ideaData) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const formData = new FormData();
  formData.append("title", ideaData.title);
  formData.append("sub_title", ideaData.sub_title);
  formData.append("full_explained_idea", ideaData.full_explained_idea);
  if (ideaData.image_url) {
    formData.append("image_url", ideaData.image_url);
  }

  const response = await fetch(`${API_BASE_URL}/ideas/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create idea");
  }

  return response.json();
};

export const fetchIdeaById = async (ideaId) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_BASE_URL}/ideas/${ideaId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to fetch idea");
  }

  return response.json();
};

export const search = async (query) => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No authentication token found.");
  }

  const response = await fetch(`${API_BASE_URL}/search/?q=${query}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to search");
  }

  return response.json();
};

