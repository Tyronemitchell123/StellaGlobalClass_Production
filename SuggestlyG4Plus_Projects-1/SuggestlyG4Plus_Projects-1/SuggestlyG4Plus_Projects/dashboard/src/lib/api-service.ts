/**
 * API Service Layer for Dashboard-MCP Server Integration
 * Handles all API communication with authentication and error handling
 */

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Check for existing token on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  // Authentication methods
  async login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseURL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (data.success) {
        this.token = data.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', data.token);
        }
        return { success: true, token: data.token };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error during login' };
    }
  }

  logout(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Dashboard API methods
  async getHealth(): Promise<any> {
    return this.get('/api/health');
  }

  async getCameras(): Promise<any> {
    return this.get('/api/cameras');
  }

  async getAIStatus(): Promise<any> {
    return this.get('/api/ai-status');
  }

  async getWeather(location: string, units: string = 'metric'): Promise<any> {
    return this.get(`/api/weather/${location}?units=${units}`);
  }

  async chat(message: string): Promise<any> {
    return this.post('/api/chat', { message });
  }

  async contact(name: string, email: string, message: string): Promise<any> {
    return this.post('/api/contact', { name, email, message });
  }

  // Generic HTTP methods
  private async get(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`GET ${endpoint} error:`, error);
      throw error;
    }
  }

  private async post(endpoint: string, data: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`POST ${endpoint} error:`, error);
      throw error;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for custom instances if needed
export { ApiService };
