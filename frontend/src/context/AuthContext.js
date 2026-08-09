import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import API_URL from '../config';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Apenas dados de exibição (nome, e-mail) ficam no sessionStorage.
        // A autenticação real é feita pelo cookie httpOnly, que o JS nunca le.
        const savedUser = sessionStorage.getItem('cvfacil_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('cvfacil_user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
        } catch (e) {
            console.error('Falha ao invalidar sessão no servidor:', e);
        }
        setUser(null);
        sessionStorage.removeItem('cvfacil_user');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
