const API_BASE_URL = 'http://localhost:8000';

export const graphService = {
  getGraphData: async (threshold = 0.75) => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph?threshold=${threshold}`);
      if (!response.ok) {
        throw new Error(`Error fetching graph data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('graphService.getGraphData error:', error);
      throw error;
    }
  }
};
