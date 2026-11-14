const API = '/.netlify/identity';

async function identityRequest(path, { method = 'GET', body, form = false, accessToken } = {}) {
  const headers = { Accept: 'application/json', 'X-Use-Cookie': '1' };
  if (body !== undefined) headers['Content-Type'] = form ? 'application/x-www-form-urlencoded' : 'application/json';
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  const response = await fetch(`${API}${path}`, {
    method,
    credentials: 'include',
    headers,
    body: body === undefined ? undefined : form ? body.toString() : JSON.stringify(body),
  });
  const raw = await response.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = {}; }
  if (!response.ok) {
    const message = data.msg || data.message || (
      response.status === 404
        ? 'O Identity do Netlify não está disponível neste endereço.'
        : response.status === 429
          ? 'Muitas tentativas. Aguarde um pouco e tente novamente.'
          : 'Não foi possível concluir. Confira os dados e tente novamente.'
    );
    throw new Error(message);
  }
  return data;
}

export async function getIdentityUser(accessToken) {
  try {
    return await identityRequest('/user', { accessToken });
  } catch (error) {
    if (/401|unauthorized|not available/i.test(error.message)) return null;
    throw error;
  }
}

export async function loginIdentity(email, password) {
  const data = await identityRequest('/token', {
    method: 'POST',
    form: true,
    body: new URLSearchParams({ grant_type: 'password', username: email, password }),
  });
  const user = await getIdentityUser(data.access_token);
  if (!user) throw new Error('Não foi possível iniciar a sessão. Tente entrar novamente.');
  return user;
}

export async function signupIdentity(email, password) {
  const data = await identityRequest('/signup', {
    method: 'POST',
    body: { email, password },
  });
  if (data.access_token) return await getIdentityUser(data.access_token);
  return null;
}

export async function requestPasswordRecovery(email) {
  await identityRequest('/recover', { method: 'POST', body: { email } });
}

export async function completePasswordRecovery(token, password) {
  const data = await identityRequest('/verify', {
    method: 'POST',
    body: { token, type: 'recovery', password },
  });
  if (data.access_token) return await getIdentityUser(data.access_token);
  return await getIdentityUser();
}

export async function confirmIdentityEmail(token) {
  const data = await identityRequest('/verify', {
    method: 'POST',
    body: { token, type: 'signup' },
  });
  if (data.access_token) return await getIdentityUser(data.access_token);
  return await getIdentityUser();
}

export async function logoutIdentity() {
  await identityRequest('/logout', { method: 'POST' });
}
