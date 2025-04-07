import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveItem: (eventId: string) => void;
}

export default function Cart({ items, isOpen, onClose, onRemoveItem }: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-6 w-6 text-indigo-600" />
              <h2 className="text-lg font-semibold">Your Cart</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.eventId} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Event #{item.eventId}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity} × ${item.price}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.eventId)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t p-4">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className={`w-full bg-indigo-600 text-white py-3 px-4 rounded-lg text-center font-medium
                ${items.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
              onClick={(e) => {
                if (items.length === 0) e.preventDefault();
              }}
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}