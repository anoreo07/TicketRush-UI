'use client';

import React from 'react';

export const SocialAuthButtons = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container-low transition-colors duration-200">
        <img
          alt="Google"
          className="w-5 h-5"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA8Q9MkPbSITI_l9nZR4oMUvPercjwvds7Gk2Y6NfWG7-tKLVWTnX7KVEX8dhAGzXslUPPihsRVDXhVgafzytBYs7fGBL9Yq8tPYrdnQCdjy4G4FKTzkKhnJ2k5qiZsOVQnfZXwU3tbDLWBwRQr2V1B2XH-HXpTNQESUVPB69K97sTkB7j_gV3I21EKzMyfXKe2Mkp5XjHE5ZUkD87RGSlbUAJ_cdzbJo0mwyYIDlo0QfjTSR3APxpaH8BX_lHZBIQvbaeR-pWzUp4"
        />
        <span className="text-sm font-semibold text-on-surface">Google</span>
      </button>
      <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container-low transition-colors duration-200">
        <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
        </svg>
        <span className="text-sm font-semibold text-on-surface">Facebook</span>
      </button>
      <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-surface border border-outline-variant hover:bg-surface-container-low transition-colors duration-200">
        <svg className="w-5 h-5 text-[#3ECF8E]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21.362 9.354H12V20.38L21.362 9.354Z"></path>
          <path d="M2.638 14.646H12V3.62L2.638 14.646Z"></path>
        </svg>
        <span className="text-sm font-semibold text-on-surface">Supabase</span>
      </button>
    </div>
  );
};
