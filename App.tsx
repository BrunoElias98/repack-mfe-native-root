import React, {Suspense, useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {useStore} from 'Cart2/store';

const Cart = React.lazy(() => import('Cart2/App'));

function App(): React.JSX.Element {
  const {count} = useStore();

  console.log('count >> ', count);

  return (
    <View style={{padding: 20, marginTop: 20}}>
      <Suspense fallback={<Text>Loading Cart2...</Text>}>
        <Cart />
      </Suspense>
      <Text>Root App</Text>
      <Text>Count from Cart2: {count}</Text> 
    </View>
  );
}

export default App;
