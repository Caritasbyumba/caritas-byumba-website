import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApiSlice = createApi({
  reducerPath: 'userAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BACKEND_URL + '/api',
  }),
  endpoints: (builder) => {
    return {
      fetchActiveCarousel: builder.query({
        query: () => {
          return '/carousels/active';
        },
      }),
      fetchActiveMoreOnUs: builder.query({
        query: () => {
          return '/moreonus/active';
        },
      }),
      fetchActiveMainProjects: builder.query({
        query: () => {
          return '/projects/main';
        },
      }),
      fetchActivePartners: builder.query({
        query: () => {
          return '/partners/active';
        },
      }),
      fetchActiveAboutus: builder.query({
        query: () => {
          return '/aboutus/active';
        },
      }),
      fetchActiveQuotes: builder.query({
        query: () => {
          return '/quotes/active';
        },
      }),
      fetchActiveProjectsIntro: builder.query({
        query: () => {
          return '/projectsintro/active';
        },
      }),
      fetchActiveProjects: builder.query({
        query: () => {
          return '/projects/active';
        },
      }),
      fetchSpecificProject: builder.query({
        query: (projectId) => {
          return `/projects/${projectId}`;
        },
      }),
      fetchActivePartnersIntro: builder.query({
        query: () => {
          return '/partnersintro/active';
        },
      }),
      fetchActiveFaqs: builder.query({
        query: () => {
          return '/faqs/active';
        },
      }),
      fetchActivePublicationsIntro: builder.query({
        query: () => {
          return '/publicationsintro/active';
        },
      }),
      fetchActivePublications: builder.query({
        query: () => {
          return '/publications/active';
        },
      }),
      fetchSpecificPublication: builder.query({
        query: (publicationId) => {
          return `/publications/${publicationId}`;
        },
      }),
      fetchActiveDonateIntro: builder.query({
        query: () => {
          return '/donateintro/active';
        },
      }),
      fetchActiveDonationAreaIntro: builder.query({
        query: () => {
          return '/donationareas/active';
        },
      }),
      fetchActiveDepartments: builder.query({
        query: () => {
          return '/departments/active';
        },
      }),
      fetchActiveServices: builder.query({
        query: () => {
          return '/services/active';
        },
      }),
      fetchActiveAdverts: builder.query({
        query: () => {
          return '/adverts/active';
        },
      }),
      fetchActiveAdvertsIntro: builder.query({
        query: () => {
          return '/advertsintro/active';
        },
      }),
      fetchActiveCharts: builder.query({
        query: () => {
          return '/charts/active';
        },
      }),
      fetchDepartmentServices: builder.query({
        query: (departmentId) => {
          return `/departments/${departmentId}/services`;
        },
      }),
      fetchSpecificAdvert: builder.query({
        query: (advertId) => {
          return `/adverts/${advertId}`;
        },
      }),
      fetchActiveDonationMessages: builder.query({
        query: () => {
          return '/donationmessages/active';
        },
      }),
    };
  },
});

export const {
  useFetchActiveCarouselQuery,
  useFetchActiveMoreOnUsQuery,
  useFetchActiveMainProjectsQuery,
  useFetchActivePartnersQuery,
  useFetchActiveAboutusQuery,
  useFetchActiveQuotesQuery,
  useFetchActiveProjectsIntroQuery,
  useFetchActiveProjectsQuery,
  useFetchSpecificProjectQuery,
  useFetchActivePartnersIntroQuery,
  useFetchActiveFaqsQuery,
  useFetchActivePublicationsIntroQuery,
  useFetchActivePublicationsQuery,
  useFetchSpecificPublicationQuery,
  useFetchActiveDonateIntroQuery,
  useFetchActiveDonationAreaIntroQuery,
  useFetchActiveDepartmentsQuery,
  useFetchActiveServicesQuery,
  useFetchActiveChartsQuery,
  useFetchActiveAdvertsQuery,
  useFetchActiveAdvertsIntroQuery,
  useFetchDepartmentServicesQuery,
  useFetchSpecificAdvertQuery,
  useFetchActiveDonationMessagesQuery,
} = userApiSlice;
