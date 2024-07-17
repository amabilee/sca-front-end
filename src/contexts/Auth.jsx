import { AuthContext } from "./authContext";
import React, { useState, useEffect } from 'react'
import { server } from "../services/server";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [error, setError] = useState('')
    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const verifyData = async () => {
            const userData = localStorage.getItem("user")
            const tokenData = localStorage.getItem("user_token")

            if (userData && tokenData) {
                setUser(JSON.parse(userData))
                setAuth(true)
                server.defaults.headers['Authentication'] = `${tokenData}`
                server.defaults.headers['access-level'] = 2
            }
        }
        verifyData()
    }, [])

    async function signIn(usuario, senha) {
        setLoading(true);
        try {
            const response = await server.post('/usuarioLogin', { usuario, senha });

            const tokenResponse = response.data.jwtToken;
            const userResponse = response.data.entity;
            setUser(userResponse);
            setAuth(true);
            localStorage.setItem('user', JSON.stringify(userResponse));
            localStorage.setItem('user_token', tokenResponse);
            setTimeout(() => {
                setLoading(false);
              }, 500)

        } catch (error) {
            setAuth(false);
            setLoading(false);
            if (error.response) {
                setError(error.response.data.message);
            }
        }
    }

    function signOut() {
        setUser({})
        setAuth(false)
        localStorage.removeItem("user")
        localStorage.removeItem("user_token")
    }
    return (
        <AuthContext.Provider value={{ user, auth, error, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
