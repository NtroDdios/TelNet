const url1 = 'https://script.google.com/macros/s/AKfycbzq6yMhMe9sYmysM9Kw8NuJBgZ9opSshazx81ruJ4VOL-4QifOP26TZnIa7rU54dZMJGA/exec';

async function test(payload, description) {
  try {
    const res = await fetch(url1, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    if (!text.includes("Cannot read properties of undefined (reading 'nivelTV601')")) {
      console.log(`FOUND KEY!!! [${description}] ->`, text);
    }
  } catch (err) {
    console.error(`Error for [${description}]:`, err.message);
  }
}

async function run() {
  const keys = [
    'nivel', 'niveles', 'tanque', 'tanques', 'medida', 'telemetria', 'telemetry',
    'dispositivo', 'device', 'sensores', 'placa', 'board', 'node', 'nodo',
    'info', 'information', 'status', 'estado', 'report', 'reporte', 'update',
    'actualizacion', 'lecturas', 'TK101', 'TK_101', 'tk101', 'tk_101',
    'TV601', 'TV_601', 'tv601', 'tv_601', 'estacion1', 'estacion01', 'erb01', 'erb_01'
  ];
  for (const key of keys) {
    const payload = {};
    payload[key] = { nivelTV601: 50 };
    await test(payload, `Key: ${key}`);
  }
  console.log('Finished testing keys.');
}

run();
