import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const kodiUrl = '/';
const playerid = 0;
const playlistid = 0;
const directory = '/storage/music/white-noise';

const baseQueryWithAuthentication = fetchBaseQuery({
  baseUrl: kodiUrl,
  // prepareHeaders: (headers) => {
  //   headers.set("Authorization", `Basic ${btoa(kodiCreds)}`);
  //   return headers;
  // },
});

const createQuery = (method, params) => ({
  url: kodiUrl,
  method: 'POST',
  body: {
    id: 1,
    jsonrpc: '2.0',
    method,
    params,
  },
});

const kodiApi = createApi({
  baseQuery: baseQueryWithAuthentication,
  keepUnusedDataFor: 0,
  reducerPath: 'kodiApi',
  endpoints: build => ({
    listFiles: build.query({
      query() {
        return createQuery('Files.GetDirectory', {
          directory,
        });
      },
      transformResponse: response =>
        (response?.result?.files || []).map(({ label }) => label),
    }),
    play: build.mutation({
      query(filename) {
        return createQuery('Player.Open', {
          item: {
            file: `${directory}/${filename}`,
          },
        });
      },
    }),
    restart: build.mutation({
      query() {
        return createQuery('Player.Seek', {
          playerid,
          value: { percentage: 0.001 },
        });
      },
    }),
    stop: build.mutation({
      query() {
        return createQuery('Player.Stop', {
          playerid,
        });
      },
    }),
    getPlayingItem: build.query({
      query() {
        return createQuery('Playlist.GetItems', {
          playlistid,
        });
      },
      transformResponse: response => {
        const item = response?.result?.items?.[0];
        return item?.label || null;
      },
    }),
    getPlayerTime: build.query({
      query() {
        return createQuery('Player.GetProperties', {
          playerid,
          properties: ['percentage', 'time', 'totaltime'],
        });
      },
    }),
    getVolume: build.query({
      query() {
        return createQuery('Application.GetProperties', {
          properties: ['volume', 'muted'],
        });
      },
    }),
    setVolume: build.mutation({
      query(volume) {
        return createQuery('Application.SetVolume', {
          volume,
        });
      },
    }),
  }),
});

export default kodiApi;
