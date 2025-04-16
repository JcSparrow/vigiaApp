import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Bell, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function Auth() {
  const { user, signIn, signInWithPhone, verifyOTP } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSocialSignIn = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      await signIn(provider);
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!showOTPInput) {
        await signInWithPhone(phoneNumber);
        setShowOTPInput(true);
        toast.success('Código enviado para seu telefone!');
      } else {
        await verifyOTP(phoneNumber, otpCode);
      }
    } catch (error) {
      toast.error('Erro ao enviar código. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-6 w-6" />
            <h1 className="text-2xl font-bold">VigiaApp</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Entrar no VigiaApp</h2>

            {/* Social Login Buttons */}
            <div className="space-y-4 mb-8">
              <button
                onClick={() => handleSocialSignIn('google')}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Continuar com Google</span>
              </button>

              <button
                onClick={() => handleSocialSignIn('facebook')}
                className="w-full flex items-center justify-center space-x-2 bg-[#1877F2] text-white rounded-lg px-4 py-2 hover:bg-[#1865F2]"
              >
                <img src="https://www.facebook.com/favicon.ico" alt="Facebook" className="w-5 h-5" />
                <span>Continuar com Facebook</span>
              </button>

              <button
                onClick={() => handleSocialSignIn('apple')}
                className="w-full flex items-center justify-center space-x-2 bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-900"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.07-.47-2.05-.48-3.18 0-1.42.61-2.16.44-3.04-.41C4.27 16.76 3.53 13.15 5 10.42c1.03-1.96 2.84-3.05 4.51-3.05 1.41.01 2.43.96 3.24.96.83 0 2.02-.92 3.59-.79 2.01.17 3.48 1.12 4.18 2.85-3.71 2.24-3.12 7.47.53 9.89zm-4.93-16.87c-2.12.18-4.07 1.87-3.8 4.09 1.89-.04 4.08-1.83 3.8-4.09z"/>
                </svg>
                <span>Continuar com Apple</span>
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou continue com</span>
              </div>
            </div>

            {/* Phone Number Login */}
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+55 (11) 98765-4321"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {showOTPInput && (
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Verificação
                  </label>
                  <input
                    type="text"
                    id="otp"
                    placeholder="Digite o código recebido por SMS"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <span>{showOTPInput ? 'Verificar Código' : 'Receber Código'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Ao continuar, você concorda com nossos{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Política de Privacidade
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}

export default Auth;