import { useEffect } from 'react';
import { AppProviders } from './context/AppContext';
import { AppRouter } from './routes/AppRouter';
import { initAmplitude } from './lib/amplitude';

export default function App() {
  useEffect(() => {
    initAmplitude();
  }, []);

  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
