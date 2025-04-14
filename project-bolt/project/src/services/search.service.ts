import { get } from './api';
import config from '../config/config';

// Advanced search service that can search across different types of content
class SearchService {
  /**
   * Search across all content types
   * @param query Search query
   * @returns Search results across different categories
   */
  public async searchAll(query: string): Promise<any> {
    return get<any>(`/search?query=${encodeURIComponent(query)}`);
  }

  /**
   * Search with filters
   * @param params Search parameters
   * @returns Filtered search results
   */
  public async searchWithFilters(params: {
    query?: string;
    categories?: string[];
    from?: string;
    to?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'date' | 'price' | 'relevance';
    order?: 'asc' | 'desc';
    limit?: number;
    page?: number;
  }): Promise<any> {
    // Build the query string
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('query', params.query);
    if (params.categories?.length) {
      params.categories.forEach(category => 
        queryParams.append('category', category)
      );
    }
    if (params.from) queryParams.append('from', params.from);
    if (params.to) queryParams.append('to', params.to);
    if (params.location) queryParams.append('location', params.location);
    if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.order) queryParams.append('order', params.order);
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    
    return get<any>(`/search/advanced?${queryParams.toString()}`);
  }

  /**
   * Get search suggestions as user types
   * @param query Partial search query
   * @param limit Maximum number of suggestions
   * @returns Search suggestions
   */
  public async getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
    return get<string[]>(`/search/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`);
  }

  /**
   * Track search for analytics
   * @param query The search query
   * @param resultsCount Number of results found
   * @param categoryClicked Category user clicked on, if any
   */
  public async trackSearch(query: string, resultsCount: number, categoryClicked?: string): Promise<void> {
    const body = {
      query,
      resultsCount,
      categoryClicked,
      timestamp: new Date().toISOString()
    };
    
    // Use fetch directly to avoid waiting for response
    if (config.enableLogging) {
      fetch(`${config.apiUrl}/analytics/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).catch(error => console.error('Failed to track search:', error));
    }
  }
}

export default new SearchService(); 