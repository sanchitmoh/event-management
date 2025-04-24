import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import AuthService from './AuthService';
import config from '../config/config';

export interface NotificationMessage {
  type: string;
  message: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  timestamp: string;
  data?: Record<string, unknown>;
}

class NotificationService {
  private client: Client | null = null;
  // Removed unused userSubscription property
  private messageHandlers: ((message: NotificationMessage) => void)[] = [];
  private userSubscription: StompSubscription | null = null;
  private globalSubscription: StompSubscription | null = null;

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const token = AuthService.getToken();
      
      if (!token) {
        reject(new Error('User not authenticated'));
        return;
      }

      this.client = new Client({
        webSocketFactory: () => new SockJS(config.websocketUrl),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: function(str) {
          if (config.enableLogging) {
            console.log('STOMP Debug:', str);
          }
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onWebSocketError: (event) => {
          console.error('WebSocket Error:', event);
          reject(new Error('WebSocket connection failed'));
        },
        onDisconnect: () => {
          console.log('WebSocket Disconnected');
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame.headers['message']);
          reject(new Error(frame.headers['message']));
        }
      });

      this.client.onConnect = () => {
        console.log('WebSocket Connected Successfully');
        this.subscribeToUserNotifications();
        this.subscribeToGlobalNotifications();
        resolve();
      };

      this.client.activate();
    });
  }

  public disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      // Removed assignment to userSubscription as it is no longer used
    }
  }

  private subscribeToUserNotifications(): void {
    if (!this.client) return;
    
    const username = AuthService.getCurrentUser()?.username;
    if (!username) return;

    this.userSubscription = this.client.subscribe(
      `/user/${username}/queue/notifications`,
      (message) => {
        try {
          const notification = JSON.parse(message.body) as NotificationMessage;
          this.notifyHandlers(notification);
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      }
    );
  }

  private subscribeToGlobalNotifications(): void {
    if (!this.client) return;

    this.globalSubscription = this.client.subscribe(
      '/topic/global-notifications',
      (message) => {
        try {
          const notification = JSON.parse(message.body) as NotificationMessage;
          this.notifyHandlers(notification);
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      }
    );
  }

  public onMessage(handler: (message: NotificationMessage) => void): () => void {
    this.messageHandlers.push(handler);
    
    // Return a function to unsubscribe this handler
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  private notifyHandlers(notification: NotificationMessage): void {
    this.messageHandlers.forEach(handler => handler(notification));
  }

  // API methods to fetch notifications from the backend
  public async getNotifications(): Promise<NotificationMessage[]> {
    const response = await fetch(`${config.apiUrl}/api/notifications`, {
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    
    return await response.json();
  }

  public async getUnreadNotifications(): Promise<NotificationMessage[]> {
    const response = await fetch(`${config.apiUrl}/api/notifications/unread`, {
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch unread notifications');
    }
    
    return await response.json();
  }

  public async markAsRead(notificationId: string): Promise<void> {
    const response = await fetch(`${config.apiUrl}/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }
  }

  public async markAllAsRead(): Promise<void> {
    const response = await fetch(`${config.apiUrl}/api/notifications/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${AuthService.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }
  }
}

export default new NotificationService(); 