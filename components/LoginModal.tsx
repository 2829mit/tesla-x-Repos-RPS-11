
import React, { useState } from 'react';

interface LoginModalProps {
  onLogin: (role: 'sales' | 'guest') => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId === 'salesrepos' && password === 'Repos@123') {
      onLogin('sales');
    } else {
      setError('Invalid credentials');
    }
  };

  const handleSkip = () => {
    onLogin('guest');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="text-gray-500 mt-2">Please sign in to access pricing</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter User ID"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter Password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-800 font-medium text-sm underline decoration-gray-300 hover:decoration-gray-800 underline-offset-4 transition-all"
          >
            Skip Login (Guest Access)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
