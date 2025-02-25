import React, {Suspense, useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useStore} from 'Cart2/store';

import {styles} from './app.styles';
import {addEventListener} from './eventListeners';

const Cart = React.lazy(() => import('Cart2/App'));
const AuthProvider = React.lazy(() => import('Cart2/AuthProvider'));

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);
  const [storageMessage, setStorageMessage] = useState<string>('');
  const {count: Counter} = useStore();
  console.log(Counter);
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

    const subscribe = addEventListener('storage_updated', updateStorageMessage);

    return () => {
      subscribe();
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.textCount}>
          Contador da parcel na Root: {count}
        </Text>
        <Text style={styles.textCount}>
          Mensagem do Storage: {storageMessage || 'Nenhuma mensagem'}
        </Text>
      </View>

      <View style={styles.contentContainer}>
        <AuthProvider>
          {authData => {
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

export default App;
