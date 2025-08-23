"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
interface CartItem {
  id: string;
  productId: number;
  productName: string;
  packSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

// Create Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider Component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.totalPrice, 0);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      // Check if item with same product and pack size already exists
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === newItem.productId && item.packSize === newItem.packSize
      );

      if (existingItemIndex > -1) {
        // Update existing item
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, { ...newItem, id: Date.now().toString() }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}