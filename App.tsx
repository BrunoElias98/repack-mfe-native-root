import React, {Suspense, useState, useEffect} from 'react';
import {StyleSheet, Text, View, DeviceEventEmitter} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Cart = React.lazy(() => import('Cart2/App'));
// @ts-ignore
const AuthProvider = React.lazy(() => import('Cart2/AuthProvider'));

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);
  const [storageMessage, setStorageMessage] = useState<string>('');

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
  };

  const updateStorageMessage = async () => {
    try {
      const value = await AsyncStorage.getItem('@shared_storage');
      const storageData = value ? JSON.parse(value) : null;
      setStorageMessage(storageData?.message || '');
    } catch (error) {
      setStorageMessage('Erro ao ler storage');
    }
  };

  useEffect(() => {
    updateStorageMessage();

    const subscription = DeviceEventEmitter.addListener(
      'storage_updated',
      updateStorageMessage,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.textCount}>Contador na Root: {count}</Text>
        <Text style={styles.textCount}>
          Mensagem do Storage: {storageMessage || 'Nenhuma mensagem'}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <AuthProvider>
          {(authData: {isSignout: boolean; isLoading: boolean}) => {
            console.log('debug >>> ', authData);
            if (authData.isLoading) {
              return (
                <View>
                  <Text>renderizar a SplashScreen</Text>
                </View>
              );
            }

            if (authData.isSignout) {
              return (
                <Suspense fallback={<Text>Loading Cart2...</Text>}>
                  <Cart onCountChange={handleCountChange} />
                </Suspense>
              );
            }

            return (
              <View>
                <Text>renderizar algo depois de logado</Text>
              </View>
            );
          }}
        </AuthProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 0.8,
  },
  textCount: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default App;
