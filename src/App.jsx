import React from 'react';
import KodiWhiteNoise from './components/KodiWhiteNoise';
import { useColorMode } from '@chakra-ui/react';

const App = () => {
  const [online, setOnline] = React.useState(navigator.onLine);

  const { toggleColorMode } = useColorMode();

  React.useEffect(() => {
    toggleColorMode();
    const handleOffline = () => setOnline(false);
    const handleOnline = () => setOnline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div>
      <KodiWhiteNoise />
    </div>
  );
};

export default App;
