import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Carregar sessão do sessionStorage (conforme solicitado: logar novamente após fechar aba)
        const savedUser = sessionStorage.getItem('cvfacil_user');
        const savedToken = sessionStorage.getItem('cvfacil_token');

        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        sessionStorage.setItem('cvfacil_user', JSON.stringify(userData));
        sessionStorage.setItem('cvfacil_token', jwtToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        sessionStorage.removeItem('cvfacil_user');
        sessionStorage.removeItem('cvfacil_token');
        router.push('/login');
    };

    const authenticatedFetch = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            'Authorization': `Bearer ${sessionStorage.getItem('cvfacil_token') || token}`
        };
        return fetch(url, { ...options, headers });
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, authenticatedFetch, loading, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
