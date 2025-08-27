const API_BASE_URL = 'http://localhost:5000';

export const tumorApi = {
  async predictTumor(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  }
};