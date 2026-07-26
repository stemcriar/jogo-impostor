export const getDeviceId = () => {
  let deviceId = localStorage.getItem('voterDeviceId');
  if (!deviceId) {
    deviceId = crypto.randomUUID ? crypto.randomUUID() : 'voter-' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('voterDeviceId', deviceId);
  }
  return deviceId;
};
