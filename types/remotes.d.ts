declare module 'Cart2/App' {
  const App: React.ComponentType<{
    onCountChange?: (newCount: number) => void;
  }>;
  export default App;
}

declare module 'Cart2/AuthProvider' {
  const AuthProvider: React.ComponentType<{
    children: (authData: { isSignout: boolean; isLoading: boolean }) => React.ReactNode;
  }>;
  export default AuthProvider;
}
