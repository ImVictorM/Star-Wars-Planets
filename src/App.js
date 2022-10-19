import React from 'react';
import Table from './components/Table';
import Filters from './components/Filters';
import './App.css';

function App() {
  return (
    <main>
      <Filters />
      <Table />
    </main>
  );
}

export default App;
