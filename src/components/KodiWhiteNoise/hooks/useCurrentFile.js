import { useState, useEffect } from 'react';
import kodiApi from 'services/kodi-api';

const { useGetPlayingItemQuery } = kodiApi;

const useCurrentFile = currentTime => {
  const { data: initialFile, isFetching } = useGetPlayingItemQuery();
  const [currentFile, setCurrentFile] = useState(null);

  useEffect(() => {
    if (initialFile) setCurrentFile(initialFile);
  }, [initialFile]);

  return {
    currentFile: currentTime.totalTime > 0 ? currentFile : null,
    isFetchingCurrentFile: isFetching,
    setCurrentFile,
  };
};

export default useCurrentFile;
