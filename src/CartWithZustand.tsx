import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';

const Cart = React.lazy(() => import('Cart2/App'));

const CartWithStore = () => {
  const [store, setStore] = useState(null);

  useEffect(() => {
    // Carregar a store do Zustand de forma assíncrona
    import('Cart2/store')
      .then((module) => {
        setStore(() => module.useStore); // Define a store carregada
      })
      .catch((error) => {
        console.error('Failed to load Cart2/store:', error);
      });
  }, []);

  // Verifica se a store foi carregada
  if (!store) {
    return <Text>Loading Cart2 store...</Text>;
  }

  // Usa a store do Zustand
  const useStore = store();
  const { count } = useStore();

  return (
    <>
      <Cart /> {/* Renderiza o componente Cart */}
      <Text>Count from Cart2: {count}</Text> {/* Mostrar o valor da store */}
    </>
  );
};

export default CartWithStore;