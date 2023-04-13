import React from 'react';
import { Flex } from '@chakra-ui/react';
import Playlist from './Playlist';
import Volume from './Volume';

const KodiWhiteNoise = () => (
  <Flex
    p={4}
    style={{
      maxWidth: 400,
      margin: '50px auto 0',
    }}
  >
    <Playlist />
    <Volume />
  </Flex>
);

export default KodiWhiteNoise;
