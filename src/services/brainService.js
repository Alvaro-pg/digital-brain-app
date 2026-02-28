const API_BASE_URL = 'http://localhost:8000';

export const brainService = {
  askQuestion: async (prompt, files = [], urls = null) => {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      
      if (urls) {
        formData.append('urls', JSON.stringify(urls));
      }
      
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/brain/ask`, {
        method: 'POST',
        body: formData, // No poner Content-Type, el navegador lo pone con el boundary
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en la petición al cerebro');
      }

      return await response.json();
    } catch (error) {
      console.error('brainService.askQuestion error:', error);
      throw error;
    }
  }
};
