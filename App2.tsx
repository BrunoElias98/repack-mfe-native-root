import React, {Suspense, useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
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

  const handleShowStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('@shared_storage');
      const storageData = value ? JSON.parse(value) : null;
      setStorageMessage(storageData?.message || '');
    } catch (error) {
      setStorageMessage('Erro ao ler storage');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textCount}>Contador na Root: {count}</Text>

      <Button title="Ver Storage" onPress={handleShowStorage} />

      <Text style={styles.textCount}>
        Mensagem do Storage: {storageMessage || 'Nenhuma mensagem'}
      </Text>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  textCount: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default App;
