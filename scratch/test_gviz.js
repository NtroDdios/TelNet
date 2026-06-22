const key1 = '2PACX-1vRquP2hMacKcZRBshBCQh1w3Ad5cIJaY4mV03zKHPaPVp2Bmb1tvPh-HihmZbVeiH63E4CZLjWLPOXu';
const url = `https://docs.google.com/spreadsheets/d/e/${key1}/gviz/tq?tqx=out:csv&tq=SELECT * LIMIT 10`;

async function run() {
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body length:', text.length);
    console.log('First 500 chars:', text.substring(0, 500));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
