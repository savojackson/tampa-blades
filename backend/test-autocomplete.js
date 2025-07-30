// Use built-in fetch for Node.js 18+ or fallback to node-fetch
let fetch;
try {
  fetch = globalThis.fetch;
} catch {
  fetch = require('node-fetch');
}

async function testAutocomplete() {
  try {
    console.log('Testing autocomplete endpoint...');
    const response = await fetch('http://localhost:4000/api/autocomplete?input=tampa');
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error testing autocomplete:', error);
  }
}

testAutocomplete(); 