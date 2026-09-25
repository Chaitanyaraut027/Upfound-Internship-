import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useStore } from '../store/useStore';
import AuthScreen from '../screens/AuthScreen';
import CustomerTabs from './CustomerTabs';
import SupplierTabs from './SupplierTabs';
import ProductDetailScreen from '../screens/customer/ProductDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const role = useStore(s => s.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!role ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : role === 'customer' ? (
        <>
          <Stack.Screen name="CustomerMain" component={CustomerTabs} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="SupplierMain" component={SupplierTabs} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
