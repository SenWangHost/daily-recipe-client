import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface HealthResponse {
  status: string;
  service?: string;
  uptime?: number;
  version?: string;
  timestamp?: string;
}

export const healthApi = createApi({
  reducerPath: 'healthApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/v1/' }),
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => 'health',
    }),
  }),
});

export const { useGetHealthQuery, useLazyGetHealthQuery } = healthApi;
