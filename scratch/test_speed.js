const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRquP2hMacKcZRBshBCQh1w3Ad5cIJaY4mV03zKHPaPVp2Bmb1tvPh-HihmZbVeiH63E4CZLjWLPOXu/pub?output=csv';

async function run() {
  const start = Date.now();
  console.log('Starting fetch...');
  try {
    const res = await fetch(url);
    const text = await res.text();
    const end = Date.now();
    console.log(`Fetch completed in ${(end - start) / 1000}s`);
    console.log(`Transferred size: ${text.length} chars`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
