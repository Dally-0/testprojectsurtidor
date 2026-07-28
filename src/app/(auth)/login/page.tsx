'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fuel, Eye, EyeOff, AlertCircle, Key, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  /**
   * Validaciones profesionales de cliente (Estándar OWASP - Prevención de Filtración de Información)
   * - No revela reglas internas de contraseñas ni da pistas a potenciales atacantes sobre el esquema.
   * - Solo verifica que los campos estén presentes y libres de caracteres peligrosos.
   */
  const validateInputs = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setError('');

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError('Por favor, ingrese su usuario o correo.');
      isValid = false;
    } else if (trimmedEmail.length > 100 || /[<>"';\\]/.test(trimmedEmail)) {
      setEmailError('Entrada no válida.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Por favor, ingrese su contraseña.');
      isValid = false;
    } else if (password.length > 100) {
      setPasswordError('Entrada no válida.');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setError('');
    setLoading(true);

    try {
      const trimmedEmail = email.trim();
      const formattedEmail = trimmedEmail.includes('@') ? trimmedEmail : `${trimmedEmail}@dallysrl.bo`;

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password,
      });

      if (authError) {
        // Mensaje genérico según OWASP para evitar enumeración de usuarios o pistas sobre credenciales
        setError('Credenciales de acceso no válidas. Verifique su usuario y contraseña.');
        setLoading(false);
        return;
      }

      if (data.session) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Ocurrió un error al procesar la solicitud de acceso.');
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = 'davidwcz05@gmail.com';
    const demoPassword = '1234lol';

    setEmail(demoEmail);
    setPassword(demoPassword);
    setEmailError('');
    setPasswordError('');
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (authError) {
        router.push('/dashboard');
        return;
      }

      if (data.session) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch {
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-accent/3 rounded-full blur-[120px]" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-2xl">
          {/* Logo & Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent/15 rounded-xl flex items-center justify-center">
                <Fuel className="w-6 h-6 text-accent" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold tracking-figma text-text-primary">
                  DALLY SRL
                </div>
                <div className="text-xs tracking-figma-wide text-text-muted">
                  SISTEMA DE GESTIÓN
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-figma text-text-primary mb-2">
              ACCESO AL SISTEMA
            </h1>
            <p className="text-sm text-text-secondary">
              Ingrese sus credenciales de operador (Supabase Auth).
            </p>
          </div>

          {/* Banner de prueba / Demo rápida */}
          <div className="mb-6 bg-accent/10 border border-accent/30 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-figma-wide text-accent flex items-center gap-1.5">
                <Key className="w-4 h-4 text-accent" /> ACCESO RÁPIDO PRESENTACIÓN (DEMO)
              </span>
              <span className="text-[10px] bg-accent/20 text-accent font-mono px-2 py-0.5 rounded-full">
                Superadmin
              </span>
            </div>
            <p className="text-xs text-text-muted">
              Usuario: <code className="text-text-primary font-mono select-all">davidwcz05@gmail.com</code> | Pass: <code className="text-text-primary font-mono select-all">1234lol</code>
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              id="btn-demo-login"
              className="w-full bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent text-xs font-bold tracking-figma py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              AUTO-RELLENAR E INGRESAR AL DASHBOARD
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} id="login-form" noValidate>
            {/* Email/Username */}
            <div className="mb-5">
              <label
                htmlFor="login-email"
                className="text-xs tracking-figma-wide text-text-muted block mb-2"
              >
                USUARIO O CORREO
              </label>
              <input
                type="text"
                id="login-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                placeholder="usuario@dallysrl.bo"
                className={`w-full bg-surface-alt border rounded-lg px-4 py-3.5 text-text-primary placeholder-text-muted focus:outline-none transition-colors ${
                  emailError ? 'border-danger focus:border-danger' : 'border-border focus:border-accent'
                }`}
                required
              />
              {emailError && (
                <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="login-password"
                className="text-xs tracking-figma-wide text-text-muted block mb-2"
              >
                CONTRASEÑA
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="••••••••"
                  className={`w-full bg-surface-alt border rounded-lg px-4 py-3.5 text-text-primary placeholder-text-muted focus:outline-none transition-colors pr-12 ${
                    passwordError ? 'border-danger focus:border-danger' : 'border-border focus:border-accent'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  id="toggle-password-visibility"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-1.5 text-xs text-danger flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {passwordError}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm text-center animate-fade-in flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Action Buttons Container */}
            <div className="grid sm:grid-cols-2 gap-3">
              <button
                type="submit"
                id="login-submit"
                disabled={loading}
                className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-background font-bold tracking-figma text-xs py-3.5 rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  'INGRESAR AL SISTEMA'
                )}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                id="btn-test-login-side"
                className="w-full bg-surface-alt hover:bg-surface-hover border border-accent/40 text-accent font-bold tracking-figma text-xs py-3.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Rellena davidwcz05@gmail.com / 1234lol e ingresa automáticamente al Dashboard"
              >
                <Zap className="w-3.5 h-3.5 text-accent" />
                PRUEBA / TEST ACCESO
              </button>
            </div>
          </form>

          {/* Supabase status indicator */}
          <div className="mt-6 text-center">
            <p className="text-xs text-text-muted">
              Conectado a Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
