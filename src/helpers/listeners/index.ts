import {DeviceEventEmitter} from 'react-native';

export const addEventListener = (eventName: string, callback: () => void) => {
  const subscription = DeviceEventEmitter.addListener(eventName, callback);
  return () => {
    subscription.remove();
  };
};

export const emitEvent = (eventName: string) => {
  DeviceEventEmitter.emit(eventName);
};
