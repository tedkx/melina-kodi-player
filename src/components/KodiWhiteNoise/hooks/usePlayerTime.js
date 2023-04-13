import { useCallback, useState, useEffect, useRef } from 'react';
import kodiApi from 'services/kodi-api';

const { useLazyGetPlayerTimeQuery } = kodiApi;

const defaultPlayerTime = {
  percentage: 0,
  playing: false,
  time: 0,
  timeStr: '00:00:00',
  totalTime: 0,
  totalTimeStr: '00:00:00',
};

const timePart = part => (part < 10 ? `0${part}` : part);
const secondsToString = seconds => {
  const hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return `${timePart(hours)}:${timePart(minutes)}:${timePart(seconds)}`;
};

const usePlayerTime = () => {
  const [currentTime, setCurrentTime] = useState(defaultPlayerTime);
  const intervalsRef = useRef({
    localInterval: null,
    serviceInterval: null,
  });

  // cleanup
  useEffect(() => {
    return () => {
      clearInterval(intervalsRef.current.localInterval);
      clearInterval(intervalsRef.current.serviceInterval);
    };
  }, []);

  const startLocalInterval = useCallback(() => {
    intervalsRef.current.localInterval = setInterval(
      () =>
        setCurrentTime(prev =>
          !prev.totalTime
            ? prev
            : {
                ...prev,
                time: prev.time + 1,
                timeStr: secondsToString(prev.time + 1),
              }
        ),
      1000
    );
  }, []);

  const setPlayerTime = useCallback(
    obj => {
      const { time, totaltime, percentage } = obj?.result || {};
      if (!time)
        return setCurrentTime(prev =>
          !prev.playing
            ? prev
            : {
                ...prev,
                time: prev.time + 1,
                timeStr: secondsToString(prev.time + 1),
              }
        );

      const timeSeconds = time.hours * 3600 + time.minutes * 60 + time.seconds;
      const totalTimeSeconds =
        totaltime.hours * 3600 + totaltime.minutes * 60 + totaltime.seconds;
      setCurrentTime({
        percentage,
        time: timeSeconds,
        timeStr: secondsToString(timeSeconds),
        totalTime: totalTimeSeconds,
        totalTimeStr: secondsToString(totalTimeSeconds),
      });

      clearInterval(intervalsRef.current.localInterval);
      if (totaltime) startLocalInterval();
    },
    [setCurrentTime]
  );

  const [getPlayerTime, getPlayerTimeResult] = useLazyGetPlayerTimeQuery();

  // start interval check every 10s
  useEffect(() => {
    getPlayerTime();

    const interval = setInterval(() => {
      getPlayerTime();
    }, 10000);
    intervalsRef.current.serviceInterval = interval;

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (getPlayerTimeResult.data) {
      setPlayerTime(getPlayerTimeResult.data);
    }
  }, [getPlayerTimeResult]);

  // local time update every sec
  useEffect(() => {
    const interval = setInterval(
      () =>
        setCurrentTime(prev =>
          !prev.playing
            ? prev
            : {
                ...prev,
                time: prev.time + 1,
                timeStr: secondsToString(prev.time + 1),
              }
        ),
      1000
    );

    return () => clearInterval(interval);
  });

  const onButtonAction = useCallback(() => {
    clearInterval(intervalsRef.current.localInterval);
    getPlayerTime();
  }, []);

  return { currentTime, onButtonAction, setPlayerTime };
};

export default usePlayerTime;
