import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ridesApi = createApi({
  reducerPath: 'ridesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/rides',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Ride'],
  endpoints: (builder) => ({
    getRides: builder.query({
      query: (params = {}) => ({
        url: '',
        params,
      }),
      providesTags: ['Ride'],
    }),
    getNearbyRides: builder.query({
      query: (params) => ({
        url: '/nearby',
        params,
      }),
      providesTags: ['Ride'],
    }),
    getRideById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ['Ride'],
    }),
    createRide: builder.mutation({
      query: (rideData) => ({
        url: '',
        method: 'POST',
        body: rideData,
      }),
      invalidatesTags: ['Ride'],
    }),
    joinRide: builder.mutation({
      query: (rideId) => ({
        url: `/${rideId}/join`,
        method: 'POST',
      }),
      invalidatesTags: ['Ride'],
    }),
    leaveRide: builder.mutation({
      query: (rideId) => ({
        url: `/${rideId}/leave`,
        method: 'POST',
      }),
      invalidatesTags: ['Ride'],
    }),
    getUserRides: builder.query({
      query: (params = {}) => ({
        url: '/user/my-rides',
        params,
      }),
      providesTags: ['Ride'],
    }),
  }),
});

export const {
  useGetRidesQuery,
  useGetNearbyRidesQuery,
  useGetRideByIdQuery,
  useCreateRideMutation,
  useJoinRideMutation,
  useLeaveRideMutation,
  useGetUserRidesQuery,
} = ridesApi;
