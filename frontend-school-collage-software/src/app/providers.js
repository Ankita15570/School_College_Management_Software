'use client';
import store from '@/redux/store/store';
import { Provider } from 'react-redux';

export function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}