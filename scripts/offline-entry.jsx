import React from 'react';
import {createRoot} from 'react-dom/client';
import Studio from '../app/page.jsx';
// Offline games and practice work; the helper explicitly reports no connection.
createRoot(document.getElementById('root')).render(<Studio offline/>);
