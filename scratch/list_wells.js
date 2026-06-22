const url2 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1/pub?output=csv';

async function run() {
  try {
    const res = await fetch(url2);
    const text = await res.text();
    const lines = text.split('\n');
    const wells = new Set();
    // Parse lines (skip header)
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      if (parts.length > 1) {
        const wellName = parts[1].trim();
        if (wellName) wells.add(wellName);
      }
    }
    console.log('Unique Wells in Database:', Array.from(wells));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
