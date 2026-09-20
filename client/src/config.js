import Constants from 'expo-constants';

const debuggerHost =
  Constants.expoConfig?.hostUri ||
  Constants.manifest2?.extra?.expoClient?.hostUri ||
  'localhost:5000';

const host = debuggerHost.split(':')[0];

export const API_BASE_URL = `http://${host}:5000`;
export const SOCKET_URL = `http://${host}:5000`;
