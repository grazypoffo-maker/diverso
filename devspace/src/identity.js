import {
  getUser,
  handleAuthCallback,
  login,
  logout,
  requestPasswordRecovery,
  signup,
  updateUser,
} from '@netlify/identity';

export async function bootIdentity() {
  const callback = await handleAuthCallback();
  const user = await getUser();
  return { callback, user };
}

export const getIdentityUser = getUser;
export const loginIdentity = login;
export const signupIdentity = signup;
export const requestIdentityPasswordRecovery = requestPasswordRecovery;
export const updateIdentityUser = updateUser;
export const logoutIdentity = logout;
