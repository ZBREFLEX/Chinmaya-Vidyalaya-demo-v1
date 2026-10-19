import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { canonicalCampusUrl } from './content/campusNavigation';
import './styles/variables.css';
import './styles/global.css';
import './styles/typography.css';
import './styles/page-shapes.css';

// Resolve shared section URLs before components read their initial detail hashes.
const campusUrl = canonicalCampusUrl(window.location);
if (campusUrl) window.history.replaceState(null, '', campusUrl);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
);
