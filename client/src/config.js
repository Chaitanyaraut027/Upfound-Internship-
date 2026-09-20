import Constants from 'expo-constants';

const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';

export const API_BASE_URL = `http://${localhost}:5000`;
export const SOCKET_URL = `http://${localhost}:5000`;
