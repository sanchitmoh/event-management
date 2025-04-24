import axios from 'axios';
import { API_ENDPOINTS } from '../config/api.config';

export interface NewsletterRequest {
  email: string;
  name?: string;
}

class NewsletterService {
  async subscribe(request: NewsletterRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(API_ENDPOINTS.NEWSLETTER.SUBSCRIBE, request);
      return response.data;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      throw error;
    }
  }

  async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.NEWSLETTER.UNSUBSCRIBE}?email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error unsubscribing from newsletter:', error);
      throw error;
    }
  }

  async checkStatus(email: string): Promise<{ subscribed: boolean; message: string }> {
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.NEWSLETTER.STATUS}?email=${encodeURIComponent(email)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error checking newsletter status:', error);
      throw error;
    }
  }
}

export default new NewsletterService(); 