import './App.css';
import { useEffect, useState } from 'react';
import { loadScifrData } from './loadScifrData';
import Main from './components/Main';

function ErrorScreen({ message }) {
  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
      <p style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: '0.95rem' }}>{message}</p>
    </main>
  );
}

export default function ScifrApp() {
  const [scifrData, setScifrData] = useState(null);
  const [booting, setBooting] = useState(true);
  const [bootError, setBootError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadScifrData()
      .then((data) => {
        if (cancelled) return;
        // data may be a report envelope { format: 'scifr', snapshot: {...} }
        // or a raw payload from mutate-scifr
        setScifrData(data?.format === 'scifr' ? data.snapshot : data);
        setBooting(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setBootError(err);
        setBooting(false);
      });

    return () => { cancelled = true; };
  }, []);

  if (booting) return null;
  if (bootError) return <ErrorScreen message={bootError.message} />;

  return <Main scifrData={scifrData} />;
}
