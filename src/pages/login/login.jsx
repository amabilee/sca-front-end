import React, { useState, useEffect } from 'react';
import Logo from '../../assets/sidebar/air-force-logo.svg';
import "./style.css";
import { UseAuth } from '../../hooks';
import Loader from '../../components/loader/index';
import { useNavigate } from 'react-router-dom';
import EyeOn from '../../assets/password/eyeOn.svg'
import EyeOff from '../../assets/password/eyeOff.svg'

function Login() {
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();
    const { signIn, error, loading, auth } = UseAuth();

    const handleAuth = async () => {
        const response = await signIn(username, pwd);
        if (auth || response === true) {
            setTimeout(() => {
                navigate('/Relatórios-Efetivo');
            }, 1000);
        }
    }

    const consultarEfetivo = () => {
        navigate('/consultarEfetivo');
    }

    useEffect(() => {
        const handleKeyPress = async (event) => {
            if (event.key === 'Enter') {
                const response = await signIn(username, pwd);
                console.log(response)
                if (auth || response === true) {
                    setTimeout(() => {
                        navigate('/Relatórios-Efetivo');
                    }, 1000);
                }
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [username, pwd, auth, navigate, signIn]);

    // Password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const togglePasswordVisibility2 = () => {
        setIsPasswordVisible2((prev) => !prev);
    };

    return (
        <>
            <div className="body-login">
                <div className="logo-container-login">
                    <img src={Logo} alt="Air Force Logo" />
                    <h1>SISTEMA DE CONTROLE DE ACESSO</h1>
                </div>
                <div className="card-login">
                    <div className="input-container">
                        <p>Usuário</p>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <p>Senha</p>
                        <div className='iconPasswordContainer'>
                            <input value={pwd} onChange={(e) => setPwd(e.target.value)} className="filtering-input password-input" type={isPasswordVisible ? 'text' : 'password'} />
                            <img src={isPasswordVisible ? EyeOff : EyeOn} className="eyePassword" onClick={togglePasswordVisibility} />
                        </div>
                    </div>
                    <p className='error-message-login'>{error}</p>
                    {loading ? (
                        <Loader />
                    ) : (
                        <button onClick={handleAuth}>Entrar</button>
                    )}
                    <p onClick={consultarEfetivo}>Consultar dados</p>
                </div>
            </div>
        </>
    );
}

export default Login;
