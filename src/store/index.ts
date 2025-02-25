export const getCartStore = async () => {
  const {useStore} = await import('Cart2/store');

  return useStore;
};

export const incrementCartCount = async () => {
  const useStore = await getCartStore();

  useStore.getState().increment();

  return useStore.getState().count;
};
