import React, { Suspense, useState, useEffect } from 'react';
import { Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { styles } from './app.styles';
import { addEventListener } from './src/helpers/listeners';
import { getCartCount } from './src/store';

const Cart = React.lazy(() => import('Cart2/App'));
const AuthProvider = React.lazy(() => import('Cart2/AuthProvider'));

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);
  const [storageMessage, setStorageMessage] = useState<string>('');
  const [cartCount, setCartCount] = useState<number | null>(null);

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
  };

  const handleGetCartCount = async () => {
    setCartCount(await getCartCount());
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
        <Text style={styles.textCount} testID="parcel-root-callback">
          Contador da parcel na Root via callback: {count}
        </Text>
        <Text style={styles.textCount} testID="parcel-root-store">
          Valor do contador da parcel na Root via store: {cartCount}
        </Text>
        <Button
          title="Pegar valor"
          testID="get-cart-count"
          onPress={handleGetCartCount}
        />
        <Text style={styles.textCount} testID="storage-message">
          Mensagem do Storage: {storageMessage || 'Nenhuma mensagem'}
        </Text>
      </View>

      <View style={styles.contentContainer} testID="cart-app-container">
        <AuthProvider>
          {({ isLoading, isSignout }) => {
            if (isLoading) {
              return (
                <View>
                  <Text>renderizar a SplashScreen</Text>
                </View>
              );
            }

            if (isSignout) {
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
