'use client';

import React, { useState } from 'react';
import { mockPaymentMethods } from '@/lib/mock/booking-data';

export const PaymentMethods = () => {
  const [selectedPayment, setSelectedPayment] = useState('pm_credit_card');

  return (
    <section className="bg-white rounded-3xl p-8 shadow-md border border-gray-200">
      <h3 className="text-lg font-headline font-bold text-gray-800 mb-6">Phương thức thanh toán</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {mockPaymentMethods.map((method) => (
          <label
            key={method.id}
            className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
              selectedPayment === method.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 bg-gray-50 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method.id}
              checked={selectedPayment === method.id}
              onChange={(e) => setSelectedPayment(e.target.value)}
              className="hidden"
            />
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 font-bold text-xs ${
                method.badge_color
                  ? `text-white`
                  : 'bg-white shadow-sm'
              }`}
              style={method.badge_color ? { backgroundColor: method.badge_color } : {}}
            >
              {method.badge_text ? (
                <span>{method.badge_text}</span>
              ) : (
                <span className="material-symbols-outlined text-purple-600">credit_card</span>
              )}
            </div>
            <div className="flex-grow">
              <p className="font-bold text-gray-800 text-sm">{method.name}</p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
            <span className={`material-symbols-outlined ${selectedPayment === method.id ? 'text-purple-500' : 'text-gray-400'}`}>
              {selectedPayment === method.id ? 'check_circle' : 'radio_button_unchecked'}
            </span>
          </label>
        ))}
      </div>

      {/* Card Details Form - Only show for credit card */}
      {selectedPayment === 'pm_credit_card' && (
        <div className="pt-6 border-t border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">Số thẻ</label>
              <input
                type="text"
                className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 font-medium text-sm"
                placeholder="**** **** **** ****"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">Tên chủ thẻ</label>
              <input
                type="text"
                className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 font-medium text-sm"
                placeholder="NGUYEN VAN A"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">Tháng hết hạn</label>
              <input
                type="text"
                className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 font-medium text-sm"
                placeholder="MM/YY"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-600 uppercase">CVV</label>
              <input
                type="text"
                className="w-full bg-gray-50 px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:outline-none text-gray-800 font-medium text-sm"
                placeholder="***"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
