const SERVICES_CONFIG = {
  baseUrl: 'http://localhost',
  port: ':3001',
  path: '/api/empresas',
};

export async function getAllEmpresas() {
  const endpoint = `${SERVICES_CONFIG.baseUrl}${SERVICES_CONFIG.port}${SERVICES_CONFIG.path}`;
  const response = await fetch(endpoint, {
    method: 'GET',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
    },
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });
  return response.json();
}
