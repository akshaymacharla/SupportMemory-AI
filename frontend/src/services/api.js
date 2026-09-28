const API_BASE = '/api';

async function request(url, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const response = await fetch(`${API_BASE}${url}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ---- Chat API ----
export async function sendMessage(customerId, message, useMemory = true) {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify({ customerId, message, useMemory }),
  });
}

// ---- Customer API ----
export async function getCustomers() {
  return request('/customers');
}

export async function getCustomer(id) {
  return request(`/customers/${id}`);
}

export async function createCustomer(customer) {
  return request('/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  });
}

// ---- Conversation API ----
export async function getConversations(customerId) {
  return request(`/conversations?customerId=${customerId}`);
}

export async function getConversation(id) {
  return request(`/conversations/${id}`);
}

// ---- Memory API ----
export async function getMemoryEvents(customerId) {
  return request(`/memory/events?customerId=${customerId}`);
}

export async function getMemoryStats() {
  return request('/memory/stats');
}

export async function getMemories(customerId) {
  return request(`/memory/recall?customerId=${customerId}`);
}

// ---- Dashboard API ----
export async function getDashboardStats() {
  return request('/dashboard/stats');
}

// ---- Demo API ----
export async function resetDemo(demoSessionId) {
  return request('/demo/reset', {
    method: 'POST',
    body: JSON.stringify(demoSessionId ? { demoSessionId } : {}),
  });
}

// ---- Health API ----
export async function healthCheck() {
  return request('/health');
}
