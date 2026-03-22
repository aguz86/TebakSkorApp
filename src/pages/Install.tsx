import React, { useState } from 'react';
import { supabaseService } from '../services/supabaseService';
import { Shield, Layout, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Install({ onComplete }: { onComplete: () => void }) {
  const [webName, setWebName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInstall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webName || !adminName || !adminEmail || !adminPassword) {
      setError('Semua field harus diisi!');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        throw new Error('Supabase URL atau Anon Key belum dikonfigurasi di environment variables.');
      }
      // Create settings in Supabase
      const success = await supabaseService.saveConfig({
        webName,
        adminEmail,
        adminPassword,
        isInstalled: true,
        installedAt: new Date().toISOString(),
      });
      if (!success) throw new Error('Gagal menyimpan konfigurasi ke Supabase. Pastikan tabel "settings" sudah dibuat.');

      onComplete();
    } catch (err: any) {
      console.error('Installation error:', err);
      setError(err.message || 'Gagal melakukan instalasi. Pastikan konfigurasi backend sudah benar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900 border border-white/10 rounded-[40px] p-8 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="p-4 bg-blue-500/10 rounded-2xl w-fit mx-auto mb-4">
            <Shield className="w-10 h-10 text-blue-500" />
          </div>
          <h1 className="text-3xl font-black text-white">Instalasi Script</h1>
          <p className="text-zinc-500 text-sm font-medium">Tentukan konfigurasi awal aplikasi Anda.</p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm font-bold">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleInstall} className="space-y-6">
          <div className="space-y-4">

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Layout className="w-3 h-3" /> Nama Website
              </label>
              <input
                type="text"
                value={webName}
                onChange={(e) => setWebName(e.target.value)}
                className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Tebak Skor Bola"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3 h-3" /> Nama Admin
              </label>
              <input
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Super Admin"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3 h-3" /> Email Admin (Google)
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3 h-3" /> Password Admin
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-zinc-800 border border-white/5 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-500 text-white font-black rounded-2xl hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Selesaikan Instalasi
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
          Pastikan data yang dimasukkan benar.
        </p>
      </motion.div>
    </div>
  );
}
