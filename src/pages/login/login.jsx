import React, { useState, useEffect } from 'react';
import Logo from '../../assets/sidebar/air-force-logo.svg';
import "./style.css";
import { UseAuth } from '../../hooks';
import Loader from '../../components/loader/index';
import { useNavigate } from 'react-router-dom';
import EyeOn from '../../assets/password/eyeOn.svg'
import EyeOff from '../../assets/password/eyeOff.svg'
import { server } from '../../services/server'

function Login() {
    const [username, setUsername] = useState('');
    const [pwd, setPwd] = useState('');
    const navigate = useNavigate();
    const { signIn, error, loading, auth } = UseAuth();

    const handleAuth = async () => {
        try {
            const response = await signIn(username, pwd);
            if (auth || response === true) {
                const modules = await getUserModulos();
                setTimeout(() => {
                    if (modules.length > 0) {
                        navigate(`${modules[0].link}`);
                    } else {
                        console.error('Nenhum módulo encontrado para navegação.');
                    }
                }, 1000)
            }
        } catch (error) {
            console.error('Erro ao autenticar ou obter módulos:', error);
        }
    };

    const consultarEfetivo = () => {
        navigate('/consultarEfetivo');
    }

    useEffect(() => {
        const handleKeyPress = async (event) => {
            if (event.key === 'Enter') {
                const response = await signIn(username, pwd);
                if (auth || response === true) {
                    const modules = await getUserModulos();
                    setTimeout(() => {
                        if (modules.length > 0) {
                            navigate(`${modules[0].link}`);
                        } else {
                            console.error('Nenhum módulo encontrado para navegação.');
                        }
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
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const getUserModulos = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/usuario/${userDataParsed.id}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            return response.data.entity[0].Modulos;
        } catch (e) {
            console.log(e);
            return [];
        }
    };

    return (
        <>
            <div className="body-login">
                <div className="logo-container-login">
                    <img src={Logo} alt="Air Force Logo" />
                    <h1>SISTEMA DE CONTROLE DE ACESSO</h1>
                </div>
                <div className="card-login">
                    <div className="card-login-title">
                        <h2>Entrar</h2>
                        <h3>Preencha os campos abaixo para acessar sua conta.</h3>
                    </div>
                    <div className="input-container">
                        <p>Usuário</p>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <p>Senha</p>
                        <div className='iconPasswordContainer'>
                            <input value={pwd} onChange={(e) => setPwd(e.target.value)} className="password-input" type={isPasswordVisible ? 'text' : 'password'} />
                            <img src={isPasswordVisible ? EyeOff : EyeOn} className="eyePassword" onClick={togglePasswordVisibility} />
                        </div>
                    </div>
                    <p className='error-message-login'>{error}</p>
                    {loading ? (
                        <Loader />
                    ) : (
                        <button onClick={handleAuth}>Entrar</button>
                    )}
                    <p onClick={consultarEfetivo}>Consulte aqui seus dados</p>
                </div>
            </div>
        </>
    );
}

export default Login;
