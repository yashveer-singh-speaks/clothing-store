'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('superadmin@store.com');
  const [password, setPassword] = useState('superadmin123@');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Invalid Super Admin credentials');
        setLoading(false);
        return;
      }
      router.push('/admin');
    } catch {
      setError('Network error while signing in');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18201B] text-[#F8F5ED] flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#F8F5ED]/80 hover:text-[#B28A50]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Customer Storefront</span>
        </Link>
        <span className="text-xs font-mono text-[#B28A50]">
          SA A/C • SUPER ADMIN GATEWAY
        </span>
      </div>

      <div className="w-full max-w-md mx-auto bg-[#F8F5ED] text-[#18201B] rounded-[8px] border-2 border-[#B28A50] p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 rounded-full bg-[#18201B] text-[#B28A50] mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#18201B]/65">
            KARIGAR & CO. • CONTROL CENTER
          </p>
          <h1 className="font-story text-2xl sm:text-3xl font-bold text-[#18201B]">
            Super Admin Sign In (SA A/C)
          </h1>
          <p className="text-xs text-[#18201B]/75">
            Access no-code Homepage CMS section builder, multi-dimensional orders, inventory, manual UPI verification, and BI analytics.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded bg-[#18201B] text-[#F8F5ED] border-l-4 border-[#B28A50] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#B28A50] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider mb-1.5">
              Super Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[6px] border border-[#18201B]/30 bg-[#F8F5ED] text-sm font-mono"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-[6px] border border-[#18201B]/30 bg-[#F8F5ED] text-sm font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-[6px] bg-[#18201B] text-[#F8F5ED] text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#18201B]/90 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#B28A50]" />
            <span>{loading ? 'Signing In...' : 'Sign In to Super Admin Dashboard'}</span>
          </button>
        </form>

        {/* Quick Reference Box */}
        <div className="p-3.5 rounded-[6px] bg-[#18201B]/[0.04] border border-[#18201B]/15 text-xs space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#B28A50]" />
            <span>Configured Super Admin Credentials:</span>
          </p>
          <p className="font-mono">Email: superadmin@store.com</p>
          <p className="font-mono">Password: superadmin123@</p>
        </div>
      </div>

      <div className="text-center text-xs text-[#F8F5ED]/60">
        Protected by RBAC Session Cookie & Immutable Audit Logging
      </div>
    </div>
  );
}