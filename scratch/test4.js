const url2 = 'https://script.google.com/macros/s/AKfycbzvORT5f8pyrca71o73mCE8xakID5ZaIyVcI5ioYRX1rRc4sXN2wQj_wD_3MYbdp2oC/exec';

async function test(payload, description) {
  try {
    const res = await fetch(url2, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const text = await res.text();
    console.log(`Result for [${description}]:`, text.substring(0, 1000));
  } catch (err) {
    console.error(`Error for [${description}]:`, err.message);
  }
}

async function run() {
  await test({ action: 'read' }, 'action: read');
  await test({ action: 'get' }, 'action: get');
  await test({ action: 'getDatos' }, 'action: getDatos');
  await test({ action: 'getPozos' }, 'action: getPozos');
  await test({ action: 'fetch' }, 'action: fetch');
  await test({ read: true }, 'read: true');
  await test({ get: true }, 'get: true');
  await test({}, 'Empty object');
}

run();
