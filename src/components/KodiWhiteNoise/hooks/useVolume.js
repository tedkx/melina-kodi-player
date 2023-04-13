import { useEffect, useState } from 'react';
import kodiApi from 'services/kodi-api';

const defaultVolume = 100;

const { useGetVolumeQuery, useSetVolumeMutation } = kodiApi;

const useVolume = () => {
  const { data: queryData, ...vol } = useGetVolumeQuery();
  const [setVolume, response] = useSetVolumeMutation();

  const [currentVolume, setCurrentVolume] = useState(defaultVolume);

  // initial response
  useEffect(() => {
    const { result } = queryData || {};
    if (typeof result?.volume === 'number') setCurrentVolume(result.volume);
  }, [queryData]);

  // update response
  useEffect(() => {
    if (typeof response?.volume === 'number') setCurrentVolume(response.volume);
  }, [response]);

  return {
    setCurrentVolume,
    setVolume,
    volume: currentVolume,
  };
};

export default useVolume;
