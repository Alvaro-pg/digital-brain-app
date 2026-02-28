const API_BASE_URL = 'http://localhost:8000';

export const graphService = {
  getGraphData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph`);
      if (!response.ok) {
        throw new Error(`Error fetching graph data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('graphService.getGraphData error:', error);
      throw error;
    }
  },
  getMemoriesByKeyword: async (keyword) => {
    try {
      const response = await fetch(`${API_BASE_URL}/memory/?keyword=${encodeURIComponent(keyword)}`);
      if (!response.ok) {
        throw new Error(`Error fetching memories: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('graphService.getMemoriesByKeyword error:', error);
      throw error;
    }
  }
};
