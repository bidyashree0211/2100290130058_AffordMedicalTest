import React, { useState, useEffect } from 'react';
import './App.css';

const MAX_WINDOW_SIZE = 10;

const API_ENDPOINTS = {
  prime: 'http://20.244.56.144/test/primes',
  fibonacci: 'http://20.244.56.144/test/fibo',
  even: 'http://20.244.56.144/test/even',
  random: 'http://20.244.56.144/test/rand',
};

function refreshWindow(window, incomingNumbers) {
  const distinctNumbers = [...new Set([...window, ...incomingNumbers])].slice(-MAX_WINDOW_SIZE);
  return distinctNumbers;
}

function computeAverage(numbers) {
  if (numbers.length === 0) return 0;
  return (numbers.reduce((total, num) => total + num, 0) / numbers.length).toFixed(2);
}

function App() {
  const [previousWindow, setPreviousWindow] = useState([]);
  const [currentWindow, setCurrentWindow] = useState([]);
  const [fetchedNumbers, setFetchedNumbers] = useState([]);
  const [average, setAverage] = useState(0);

  async function retrieveNumbers(category) {
    if (!API_ENDPOINTS[category]) {
      console.error('Invalid number category specified');
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 500);
      const response = await fetch(API_ENDPOINTS[category], { signal: controller.signal });
      clearTimeout(timeout);

      if (response.ok) {
        const data = await response.json();
        const newNumbers = data.numbers;

        setPreviousWindow(currentWindow);

        const updatedWindow = refreshWindow(currentWindow, newNumbers);
        setCurrentWindow(updatedWindow);

        setFetchedNumbers(newNumbers);

        setAverage(computeAverage(updatedWindow));
      } else {
        console.error('API request failed');
      }
    } catch (error) {
      console.error('Error retrieving numbers:', error.message);
    }
  }

  return (
    <div className="App">
      <h1>Number Average Calculator Service</h1>
      <div>
        <button onClick={() => retrieveNumbers('prime')}>Prime Numbers</button>
        <button onClick={() => retrieveNumbers('fibonacci')}>Fibonacci Numbers</button>
        <button onClick={() => retrieveNumbers('even')}>Even Numbers</button>
        <button onClick={() => retrieveNumbers('random')}>Random Numbers</button>
      </div>

      <div>
        <h3>Previous Window:</h3>
        <pre>{JSON.stringify(previousWindow, null, 2)}</pre>

        <h3>Current Window:</h3>
        <pre>{JSON.stringify(currentWindow, null, 2)}</pre>

        <h3>Fetched Numbers:</h3>
        <pre>{JSON.stringify(fetchedNumbers, null, 2)}</pre>

        <h3>Average:</h3>
        <p>{average}</p>
      </div>
    </div>
  );
}

export default App;
