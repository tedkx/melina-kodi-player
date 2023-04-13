import React from 'react';
import {
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import useVolume from './hooks/useVolume';

const Volume = () => {
  const { setCurrentVolume, setVolume, volume } = useVolume();

  return (
    <Flex alignItems="center" flexDirection="column" justifyContent="center">
      <Box width={30} mb={2} textAlign="center" fontWeight="bold" mt={-1}>
        {volume}
      </Box>
      <Box flexGrow="1">
        <Slider
          aria-label="slider-ex-1"
          orientation="vertical"
          max={100}
          min={0}
          onChange={setCurrentVolume}
          onChangeEnd={setVolume}
          value={volume}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
    </Flex>
  );
};

export default Volume;
