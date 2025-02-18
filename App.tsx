import React, {Suspense, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Cart = React.lazy(() => import('Cart2/App'));
// @ts-ignore
const AuthProvider = React.lazy(() => import('Cart2/AuthProvider'));

function App(): React.JSX.Element {
  const [count, setCount] = useState(0);

  const handleCountChange = (newCount: number) => {
    setCount(newCount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textCount}>Contador na Root: {count}</Text>

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
