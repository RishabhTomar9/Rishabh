
import React, { useState } from 'react';
import { auth } from '../../firebase';
import { signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGoogle, FaLock } from 'react-icons/fa';

const Login = () => {
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (user.email === 'rishabhtomar9999@gmail.com') {
                navigate('/admin/dashboard');
            } else {
                setError('Access Denied. You are not an authorized administrator.');
                await auth.signOut();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-zinc-900/50 backdrop-blur-xl border border-white/5 p-8 rounded-xl w-full max-w-md relative z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-purple-500/20">
                        <FaLock className="text-2xl text-purple-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-zinc-500 text-sm">Restricted access for authorized personnel only.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-white text-black hover:bg-zinc-200 transition-colors py-3 rounded-xl font-bold flex items-center justify-center gap-3"
                >
                    <FaGoogle /> Sign in with Google
                </button>
            </motion.div>
        </div>
    );
};

export default Login;
