const url1 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRquP2hMacKcZRBshBCQh1w3Ad5cIJaY4mV03zKHPaPVp2Bmb1tvPh-HihmZbVeiH63E4CZLjWLPOXu/pub?output=csv';
const url2 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1/pub?output=csv';

async function checkHeaders(url, name) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const lines = text.split('\n');
    console.log(`=== ${name} Headers ===`);
    console.log(lines[0]);
    console.log(`=== ${name} Line 1 ===`);
    console.log(lines[1]);
    console.log(`=== ${name} Line 2 ===`);
    console.log(lines[2]);
    console.log(`Total rows: ${lines.length}`);
  } catch (err) {
    console.error(`Error for ${name}:`, err.message);
  }
}

async function run() {
  await checkHeaders(url1, 'Estaciones');
  await checkHeaders(url2, 'Pozos');
}

run();
