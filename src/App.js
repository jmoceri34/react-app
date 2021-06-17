import './App.css';
import About from './About';
import { useState } from 'react';

function App() {
    const [videoId] = useState('Z3v0tEApe50')
    return (
        <About videoId={videoId} />
  );
}

export default App;
