const API_BASE_URL = 'http://localhost:8000';

export const brainService = {
  // Procesa todo junto y crea un unico resumen/memoria
  processSingleSummary: async (prompt, files = [], urls = null) => {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      
      if (urls) {
        formData.append('urls', Array.isArray(urls) ? JSON.stringify(urls) : urls);
      }
      
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/brain/ask/single-summary`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en procesamiento unificado');
      }

      return await response.json();
    } catch (error) {
      console.error('brainService.processSingleSummary error:', error);
      throw error;
    }
  },

  // Procesa cada archivo individualmente y crea múltiples memorias
  processPerFile: async (prompt, files = []) => {
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('files', file);
        });
      }

      const response = await fetch(`${API_BASE_URL}/brain/ask/per-file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Error en procesamiento individual');
      }

      return await response.json();
    } catch (error) {
      console.error('brainService.processPerFile error:', error);
      throw error;
    }
  }
};
