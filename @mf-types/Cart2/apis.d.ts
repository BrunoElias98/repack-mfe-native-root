
    export type RemoteKeys = 'Cart2/App';
    type PackageType<T> = T extends 'Cart2/App' ? typeof import('Cart2/App') :any;