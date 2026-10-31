import { createRoot } from 'react-dom/client';
import ScifrApp from './ScifrApp';

const rootElement = document.getElementById('root');

if (rootElement === null) {
  throw new Error('Missing root element');
}

createRoot(rootElement).render(<ScifrApp />);
