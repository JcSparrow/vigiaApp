// src/pages/Login.jsx
import { useState } from 'react';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  const handleSendOTP = () => {
    // Aqui você faria a integração com o backend ou serviço tipo Firebase Auth
    console.log("Enviando OTP para:", phone);
    setOtpSent(true);
  };

  const handleVerifyOTP = () => {
    // Simular verificação
    console.log("Verificando código:", otp);
    // Redireciona para Home, por exemplo
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">Entrar no VigiaApp</h1>
        
        <input
          type="tel"
          className="w-full mb-3 p-3 border rounded-xl"
          placeholder="Telefone ex: +25884..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {otpSent ? (
          <>
            <input
              type="text"
              className="w-full mb-3 p-3 border rounded-xl"
              placeholder="Código OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOTP}
              className="bg-green-500 w-full py-2 text-white rounded-xl"
            >
              Verificar Código
            </button>
          </>
        ) : (
          <button
            onClick={handleSendOTP}
            className="bg-blue-500 w-full py-2 text-white rounded-xl"
          >
            Enviar Código SMS
          </button>
        )}

        <div className="text-sm text-center mt-4 text-gray-500">ou entre com</div>
        
        <div className="flex justify-center mt-4 gap-4">
          <button className="bg-gray-100 p-2 rounded-xl">Google</button>
          <button className="bg-gray-100 p-2 rounded-xl">Facebook</button>
        </div>
      </div>
    </div>
  );
}
