const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRquP2hMacKcZRBshBCQh1w3Ad5cIJaY4mV03zKHPaPVp2Bmb1tvPh-HihmZbVeiH63E4CZLjWLPOXu/pub?output=csv';

async function run() {
  try {
    // First, let's send a HEAD request to check size and Accept-Ranges support
    const headRes = await fetch(url, { method: 'HEAD' });
    console.log('=== HEAD HEADERS ===');
    for (const [key, value] of headRes.headers.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // Now let's try a GET request with Range: bytes=-50000 (last 50KB)
    console.log('\n=== GET WITH RANGE ===');
    const getRes = await fetch(url, {
      headers: {
        'Range': 'bytes=-50000'
      }
    });
    console.log('Status:', getRes.status);
    const text = await getRes.text();
    console.log('Body length:', text.length);
    console.log('First 200 chars of range:', text.substring(0, 200));
    console.log('Last 200 chars of range:', text.substring(text.length - 200));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

run();
