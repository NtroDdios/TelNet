const url1 = 'https://script.google.com/macros/s/AKfycbzq6yMhMe9sYmysM9Kw8NuJBgZ9opSshazx81ruJ4VOL-4QifOP26TZnIa7rU54dZMJGA/exec';
const url2 = 'https://script.google.com/macros/s/AKfycbzvORT5f8pyrca71o73mCE8xakID5ZaIyVcI5ioYRX1rRc4sXN2wQj_wD_3MYbdp2oC/exec';

const params = [
  'action=read',
  'action=get',
  'action=getDatos',
  'action=getEstaciones',
  'action=getPozos',
  'action=select',
  'action=fetch',
  'read=true',
  'get=true',
  'format=json',
  'type=json',
  'method=read',
  'method=get',
  'datos=true',
  'api=true'
];

async function run() {
  console.log('--- TESTING URL 1 (Estaciones) GET WITH PARAMS ---');
  for (const p of params) {
    try {
      const res = await fetch(`${url1}?${p}`);
      const text = await res.text();
      // If it returns JSON (starts with { or [), or is not the clock HTML
      if (text.trim().startsWith('{') || text.trim().startsWith('[') || !text.includes('MONITOREO ACTIVO')) {
        console.log(`Param ${p} returned:`, text.substring(0, 200));
      } else {
        console.log(`Param ${p} returned clock HTML`);
      }
    } catch (err) {
      console.error(`Error for URL 1 with ${p}:`, err.message);
    }
  }

  console.log('--- TESTING URL 2 (Pozos) GET WITH PARAMS ---');
  for (const p of params) {
    try {
      const res = await fetch(`${url2}?${p}`);
      const text = await res.text();
      // If it doesn't return the "No se encontró la función doGet"
      if (!text.includes('No se encontró la función de la secuencia de comandos: doGet')) {
        console.log(`Param ${p} returned:`, text.substring(0, 200));
      } else {
        console.log(`Param ${p} returned doGet error`);
      }
    } catch (err) {
      console.error(`Error for URL 2 with ${p}:`, err.message);
    }
  }
}

run();
