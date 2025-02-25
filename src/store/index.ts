const importCartStore = async () => {
  const { useStore } = await import('Cart2/store');
  return useStore;
};

export const getCartStore = async () => {
  return await importCartStore();
};

export const getCartCount = async () => {
  const { getState } = await getCartStore();
  const { count } = getState();

  return count;
};
