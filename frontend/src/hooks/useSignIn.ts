import { useState, type FormEvent } from "react";
import {useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function useSignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
    const { login } = useAuth();
    
    const data = {
        email: '',
        password: '',
    }
    const [loginUser, setLoginsUser] = useState(data);
    const [error, setError] = useState(data);

    const loginGoogle = async () => {
        const base = import.meta.env.VITE_API_URL || "";
        window.location.href = `${base}/api/auth/google`;
    }

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'email': {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? '' : 'Invalid email address';
            }
            case 'password':
                return value.trim() === '' ? 'Password is required' : '';
            default:
                return '';
        }
    };

    const handleSignIn = async (e?: FormEvent) => {
        // prevent default if this was called from a form submit
        e?.preventDefault();

        const validationErrors = {
            email: validateField('email', loginUser.email),
            password: validateField('password', loginUser.password),
        };

        setError(validationErrors);
        if (Object.values(validationErrors).some((err) => err !== '')) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const success = await login(loginUser.email, loginUser.password);
            
            if (success) {
                setLoginsUser({
                    email: '',
                    password: '',
                });

                const from = location.state?.from?.pathname || '/dashboard';

                // Option: reload first, then navigate after reload using sessionStorage flag
                sessionStorage.setItem('postLoginNavigate', from);
                // give a short delay then reload so user sees transition/feedback
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

                // Note: alternative approach is to navigate first then reload:
                // navigate(from, { replace: true });
                // setTimeout(() => window.location.reload(), 1000);
            }
        } catch (err) {
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    }
    

    return {
        showPassword,
        isChecked,
        isLoading,
        loginUser,
        setShowPassword,
        setIsChecked,
        setLoginsUser,
        handleSignIn,
        error,
        loginGoogle
    }
}