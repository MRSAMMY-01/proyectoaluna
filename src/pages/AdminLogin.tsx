import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { Lock, ArrowLeft, Eye, EyeOff, Mail } from 'lucide-react';
import { auth } from '@/lib/firebase';

// Maps Firebase Auth error codes to user-friendly Spanish messages.
// Deliberately vague on "which field is wrong" to avoid leaking account info.
function parseFirebaseError(err: AuthError): string {
  switch (err.code) {
    case 'auth/invalid-email':
      return 'El correo ingresado no tiene un formato válido.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos. Verifica tus datos e intenta nuevamente.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. La cuenta ha sido bloqueada temporalmente. Intenta más tarde.';
    case 'auth/network-request-failed':
      return 'Sin conexión a internet. Verifica tu red e intenta nuevamente.';
    case 'auth/user-disabled':
      return 'Esta cuenta ha sido deshabilitada. Contacta al administrador.';
    default:
      return 'Ocurrió un error inesperado. Intenta nuevamente.';
  }
}

export default function AdminLogin() {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]               = useState('');
  const [loading, setLoading]           = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged in AdminPage will detect the new session automatically.
      // No manual localStorage write needed.
    } catch (err) {
      setError(parseFirebaseError(err as AuthError));
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-fuchsia-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-pink-400 hover:text-pink-600 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </button>

        <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            {/* Logo + candado badge */}
            <div className="relative mb-4 w-32 h-32">
              <img
                src="/logoinicio1.png"
                alt="Aluna Moda Maternal"
                className="w-full h-full object-contain"
              />
              <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-pink-100 shadow-md flex items-center justify-center">
                <Lock size={15} className="text-pink-500" />
              </span>
            </div>

            <h1
              className="font-playfair text-2xl font-bold text-rose-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Panel Administrativo
            </h1>
            <p className="text-rose-700/60 text-sm mt-1.5 text-center">
              Ingresa tus credenciales para administrar tus productos
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
                autoComplete="email"
                autoFocus
                required
                className="w-full bg-pink-50 border border-pink-200 rounded-2xl px-5 py-3.5 pl-11 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-300 pointer-events-none" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                autoComplete="current-password"
                required
                className="w-full bg-pink-50 border border-pink-200 rounded-2xl px-5 py-3.5 pr-12 text-rose-900 placeholder-rose-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-pink-400 hover:text-pink-600 transition-colors"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded-xl py-2 px-4 animate-fade-up">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-xs text-rose-700/40 mt-6">
            Aluna Moda Maternal · Acceso restringido
          </p>
        </div>
      </div>
    </div>
  );
}
