import { useCallback, useEffect } from 'react';
import kodiApi from 'services/kodi-api';

const { usePlayMutation, useRestartMutation, useStopMutation } = kodiApi;

const useButtonActions = (setCurrentFile, getPlayerTime) => {
  const [play, playResult] = usePlayMutation();
  const [stop, stopResult] = useStopMutation();
  const [restart, restartResult] = useRestartMutation();

  const onPlay = useCallback(
    file => {
      play(file);
      setCurrentFile(file);
    },
    [setCurrentFile, play]
  );

  useEffect(() => {
    if (playResult?.data || stopResult?.data || restartResult?.data)
      getPlayerTime();
  }, [playResult?.data, stopResult?.data, restartResult?.data]);

  return {
    play: onPlay,
    stop,
    restart,
    actionPending:
      playResult.isLoading || stopResult.isLoading || restartResult.isLoading,
  };
};

export default useButtonActions;
