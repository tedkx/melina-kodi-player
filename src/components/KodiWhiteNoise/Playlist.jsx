import React from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Text,
  UnorderedList,
  ListItem,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from '@chakra-ui/react';
import { ArrowLeftIcon, TriangleUpIcon } from '@chakra-ui/icons';
import kodiApi from 'services/kodi-api';
import usePlayerTime from './hooks/usePlayerTime';
import useButtonActions from './hooks/useButtonActions';
import useCurrentFile from './hooks/useCurrentFile';

const { useListFilesQuery } = kodiApi;

const mockFiles = ['cook-hood.mp3', 'night-rain.m4a'];

const Playlist = () => {
  const { data: files = mockFiles } = useListFilesQuery();

  const { currentTime, onButtonAction } = usePlayerTime();

  const { currentFile, isFetchingCurrentFile, setCurrentFile } =
    useCurrentFile(currentTime);

  const { play, stop, restart, actionPending } = useButtonActions(
    setCurrentFile,
    onButtonAction
  );

  const disabled = actionPending || isFetchingCurrentFile;
  const { percentage, timeStr, totalTimeStr } = currentTime;

  return (
    <Card mr={15} style={{ flexGrow: 1 }}>
      <CardHeader p={0}>
        <Box
          p={3}
          pb={2}
          m={2}
          bg="#22252A"
          borderRadius={4}
          boxShadow="inset 0 0 20px -10px #001"
        >
          <Box fontSize={11}>Now Playing</Box>
          <Box fontSize={22} fontWeight="bold" mb={2}>
            <Text textShadow="0 0 5px #888B95">{currentFile || '--'}</Text>
          </Box>
          <Flex align="center">
            <Box fontSize={12} fontFamily="Consolas" mr={2}>
              {timeStr}
            </Box>
            <Slider
              isDisabled={!currentFile || disabled}
              aria-label="slider-ex-1"
              min={0}
              max={100}
              isReadOnly
              value={percentage}
            >
              <SliderTrack>
                <SliderFilledTrack bg="#66696F" />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Box fontSize={12} fontFamily="Consolas" ml={2}>
              {totalTimeStr}
            </Box>
          </Flex>
        </Box>
        <Flex mb={3} mt={-2} mr={2} ml={2}>
          <Button
            isDisabled={disabled}
            flexGrow="1"
            borderTopRightRadius={0}
            borderBottomRightRadius={0}
            onClick={restart}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            isDisabled={disabled}
            flexGrow="1"
            borderRadius={0}
            onClick={stop}
          >
            <svg viewBox="0 0 24 24" className="chakra-icon css-onkibi">
              <rect x="1" y="1" width="22" height="22" fill="currentColor" />
            </svg>
          </Button>
          <Button
            isDisabled={disabled}
            onClick={() => files?.length && play(files[0])}
            flexGrow="1"
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
          >
            <TriangleUpIcon style={{ transform: 'rotate(90deg)' }} />
          </Button>
        </Flex>
      </CardHeader>
      <CardBody p={0} pr={2} pb={3}>
        <UnorderedList styleType="none" borderTop="solid 1px #44474B">
          {files.map(file => (
            <ListItem
              key={file}
              cursor="pointer"
              pb={2}
              pt={2}
              borderBottom="solid 1px #44474B"
              onClick={() => play(file)}
            >
              {file}
            </ListItem>
          ))}
        </UnorderedList>
      </CardBody>
    </Card>
  );
};

export default Playlist;
