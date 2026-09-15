import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Harap isi email dan password administrator.');
      return;
    }

    try {
      await login(email, password);
      setSuccessMsg('Verifikasi Admin Berhasil! Mengalihkan ke Dashboard...');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Akses Ditolak: Kredensial tidak valid atau akun Anda bukan Administrator.');
    }
  };

  const handleAdminPreset = () => {
    setEmail('admin@eventify.id');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-neo-bg flex items-center justify-center p-4 font-jakarta relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute -top-12 -left-12 w-72 h-72 bg-neo-yellow border-3 border-neo-dark rounded-full opacity-40 blur-xs -z-10" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-neo-pink border-3 border-neo-dark rounded-full opacity-40 blur-xs -z-10" />

      <div className="w-full max-w-md">
        {/* Header Logo transparent */}
        <div className="text-center mb-6">
          <div className="inline-block p-2 mb-2">
            <img
              src="/eventify-logo.png"
              alt="Eventify Logo"
              className="h-20 mx-auto object-contain drop-shadow-[3px_3px_0px_#2B2630]"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-neo-yellow rounded-md border-2 border-neo-dark font-space font-extrabold text-xs uppercase tracking-wider shadow-neo-sm">
            <ShieldCheck size={14} className="text-neo-dark" /> PORTAL KHUSUS ADMINISTRATOR
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-neo-lg border-3 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Admin Verification Notice */}
            <div className="p-3 bg-neo-mint/30 rounded-xl border-2 border-neo-dark text-xs font-semibold text-neo-dark flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-800 shrink-0" />
              <span>Sistem terverifikasi: Hanya akun bertipe <strong>"admin"</strong> yang diizinkan mengakses portal ini.</span>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 bg-neo-pink text-neo-dark border-2.5 border-neo-dark rounded-xl shadow-neo-sm font-jakarta text-xs font-extrabold flex items-center gap-2.5 animate-bounce">
                <ShieldAlert size={20} className="shrink-0 text-neo-dark" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMsg && (
              <div className="p-3.5 bg-neo-mint text-neo-dark border-2.5 border-neo-dark rounded-xl shadow-neo-sm font-jakarta text-xs font-extrabold flex items-center gap-2.5">
                <CheckCircle2 size={20} className="shrink-0 text-neo-dark" />
                <span>{successMsg}</span>
              </div>
            )}

            <Input
              label="Email Administrator"
              type="email"
              placeholder="admin@eventify.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />

            <Input
              label="Password Admin"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              icon={<ArrowRight size={20} />}
            >
              {isLoading ? 'Verifikasi Admin...' : 'Masuk Portal Admin'}
            </Button>
          </form>

          {/* Admin Preset Quick Fill */}
          <div className="mt-5 pt-4 border-t-2 border-neo-dark">
            <button
              type="button"
              onClick={handleAdminPreset}
              className="w-full py-2 px-3 bg-neo-yellow text-neo-dark rounded-xl border-2 border-neo-dark shadow-neo-sm font-space font-extrabold text-xs uppercase hover:bg-yellow-300 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              🔑 Isi Kredensial Admin Demo (admin@eventify.id)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
