import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, addToCart, removeCartItem, updateCartItem, selectCartItems, selectCartCount, selectCartTotal } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const total = useSelector(selectCartTotal);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchCart());
  }, [isAuthenticated, dispatch]);

  const handleAddToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) { toast.error('Please login to add items to cart'); return; }
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      toast.success('Added to cart!');
    } catch (err) { toast.error(err || 'Failed to add to cart'); }
  };

  const handleRemove = async (cartItemId) => {
    try { await dispatch(removeCartItem(cartItemId)).unwrap(); }
    catch (err) { toast.error('Failed to remove item'); }
  };

  const handleUpdate = async (cartItemId, quantity) => {
    try { await dispatch(updateCartItem({ cartItemId, quantity })).unwrap(); }
    catch (err) { toast.error('Failed to update cart'); }
  };

  return (
    <CartContext.Provider value={{ items, count, total, addToCart: handleAddToCart, removeItem: handleRemove, updateItem: handleUpdate }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
