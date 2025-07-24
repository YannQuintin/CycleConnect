import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/users',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => '/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/${id}`,
      providesTags: ['User'],
    }),
    updateLocation: builder.mutation({
      query: (locationData) => ({
        url: '/location',
        method: 'PUT',
        body: locationData,
      }),
      invalidatesTags: ['User'],
    }),
    getNearbyUsers: builder.query({
      query: (params) => ({
        url: '/nearby/cyclists',
        params,
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useUpdateLocationMutation,
  useGetNearbyUsersQuery,
} = usersApi;
