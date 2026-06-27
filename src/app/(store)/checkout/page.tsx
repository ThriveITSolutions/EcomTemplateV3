'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, CreditCard, Truck, Shield, Lock, ChevronRight } from 'lucide-react';

// Sample checkout data
const cartItems = [
  { id: '1', name: 'Premium Cotton T-Shirt', variant: 'Black / M', price: 1200, quantity: 2, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100' },
  { id: '2', name: 'Slim Fit Jeans', variant: '32 / Blue', price: 2500, quantity: 1, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100' },
];

const subtotal = 4900;
const shipping = 0; // Free shipping
const tax = 368;
const total = 5268;

const paymentMethods = [
  { id: 'cod', name: 'Cash on Delivery', icon: Truck },
  { id: 'bkash', name: 'bKash', icon: () => <span className="text-pink-500 font-bold">bK</span> },
  { id: 'stripe', name: 'Credit Card', icon: CreditCard },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [orderComplete, setOrderComplete] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    // In production, this would process the order
    setOrderComplete(true);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-medium mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-2">Your order number is <span className="font-medium">ORD-2024-0007</span></p>
          <p className="text-gray-500 mb-8">We've sent a confirmation email to your inbox.</p>
          
          <div className="max-w-md mx-auto border rounded-lg p-6 text-left mb-8">
            <h3 className="font-medium mb-4">Order Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Number</span>
                <span className="font-medium">ORD-2024-0007</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated Delivery</span>
                <span className="font-medium">3-5 Business Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total</span>
                <span className="font-medium">৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link 
              href="/account/orders"
              className="px-6 py-3 border rounded font-medium hover:bg-gray-50"
            >
              View Order
            </Link>
            <Link 
              href="/products"
              className="px-6 py-3 bg-black text-white rounded font-medium hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold tracking-tight">FASHION STORE</Link>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 py-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step > 1 ? 'bg-green-500 text-white' : step === 1 ? 'bg-black text-white' : 'bg-gray-200'
              }`}>
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-sm font-medium">Information</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step > 2 ? 'bg-green-500 text-white' : step === 2 ? 'bg-black text-white' : 'bg-gray-200'
              }`}>
                {step > 2 ? <Check className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-black' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-sm font-medium">Confirm</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-medium mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Email me with news and offers</span>
                  </label>
                </div>

                <h2 className="text-lg font-medium mb-6 mt-8">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="+880 1XXX XXXXXX"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input 
                    type="text" 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input 
                      type="text" 
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input 
                      type="text" 
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  className="w-full mt-8 bg-black text-white py-4 rounded font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-medium mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label 
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedPayment === method.id ? 'border-black bg-gray-50' : 'hover:border-gray-400'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="sr-only"
                      />
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                        {selectedPayment === method.id && (
                          <div className="w-3 h-3 rounded-full bg-black" />
                        )}
                      </div>
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                        {(() => {
                          const Icon = method.icon as any;
                          return <Icon className="w-5 h-5" />;
                        })()}
                      </div>
                      <span className="font-medium">{method.name}</span>
                    </label>
                  ))}
                </div>

                {selectedPayment === 'stripe' && (
                  <div className="mt-6 p-4 border rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input 
                          type="text"
                          className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                          placeholder="4242 4242 4242 4242"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry</label>
                          <input 
                            type="text"
                            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                          <input 
                            type="text"
                            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 mt-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="px-6 py-4 border rounded font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="flex-1 bg-black text-white py-4 rounded font-medium hover:bg-gray-800 transition-colors"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-medium mb-6">Review Your Order</h2>
                
                <div className="border rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-sm text-gray-600">
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.postalCode}<br />
                    {formData.phone}
                  </p>
                </div>

                <div className="border rounded-lg p-4 mb-6">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="text-sm text-gray-600">
                    {paymentMethods.find(m => m.id === selectedPayment)?.name}
                  </p>
                </div>

                <div className="border-t pt-6 flex items-center gap-2 text-sm text-gray-500 mb-6">
                  <Shield className="w-4 h-4" />
                  <span>Your personal data will be used to process your order and support your experience.</span>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep(2)}
                    className="px-6 py-4 border rounded font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-black text-white py-4 rounded font-medium hover:bg-gray-800 transition-colors"
                  >
                    Place Order - ৳{total.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-24">
              <h3 className="font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    </div>
                    <p className="text-sm">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `৳${shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7.5%)</span>
                  <span>৳{tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>৳{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}