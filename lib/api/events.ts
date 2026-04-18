/**
 * Event API Endpoints
 */

import { apiFetch } from './client';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  image: string;
}

export interface GetEventsResponse {
  events: Event[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Event API Methods
 */
export const eventApi = {
  getAll: (page?: number, pageSize?: number) =>
    apiFetch<GetEventsResponse>('/events', {
      method: 'GET',
    }),

  getById: (id: string) =>
    apiFetch<Event>(`/events/${id}`, {
      method: 'GET',
    }),

  search: (query: string) =>
    apiFetch<GetEventsResponse>(`/events/search?q=${query}`, {
      method: 'GET',
    }),
};
