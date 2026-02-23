
import React, { useState } from 'react';
import { api } from '../services/api';

const Login: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (isLogin) {
                const { error } = await api.signIn(email, password);
                if (error) throw error;
            } else {
                const { error } = await api.signUp(email, password);
                if (error) throw error;
                setMessage('¡Revisa tu correo para confirmar el registro!');
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark p-4 relative overflow-hidden">
            {/* Background elements for "WOW" factor */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse"></div>

            <div className="w-full max-w-md bg-white dark:bg-[#1e293b] rounded-[2.5rem] shadow-2xl shadow-primary/5 p-8 md:p-12 relative z-10 border border-white/20 dark:border-gray-800 backdrop-blur-xl animate-in fade-in zoom-in duration-700">
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6 rotate-3 transform transition-transform hover:rotate-6 cursor-pointer">
                        <span className="material-symbols-outlined text-white text-3xl">bolt</span>
                    </div>
                    <h1 className="text-3xl font-black text-[#0d121c] dark:text-white mb-2">David Focus</h1>
                    <p className="text-[#49659c] dark:text-gray-400 text-center font-medium">
                        {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta personalizada'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-widest ml-1">Email</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#49659c] text-xl">mail</span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-[#49659c] dark:text-gray-400 uppercase tracking-widest ml-1">Contraseña</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#49659c] text-xl">lock</span>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-[#ced7e8] dark:border-gray-700 bg-[#f8fafc] dark:bg-gray-800 text-[#0d121c] dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                            <span className="material-symbols-outlined">error</span>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
                            <span className="material-symbols-outlined">check_circle</span>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/20 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            <>
                                {isLogin ? 'Entrar ahora' : 'Registrar cuenta'}
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-[#ced7e8] dark:border-gray-800 text-center">
                    <p className="text-[#49659c] dark:text-gray-400 font-medium">
                        {isLogin ? '¿No tienes cuenta?' : '¿Ya eres usuario?'}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 text-primary hover:text-primary-hover font-black underline underline-offset-4 decoration-primary/30 transition-colors"
                        >
                            {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
