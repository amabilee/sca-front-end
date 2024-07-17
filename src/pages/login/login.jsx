import React, { useState } from 'react'
import Logo from '../../assets/sidebar/air-force-logo.svg'
import "./style.css"
import { UseAuth } from '../../hooks';
import Loader from '../../components/loader/index'
import { useNavigate } from 'react-router-dom'

function login() {
  const [username, setUsername] = useState('')
  const [pwd, setPwd] = useState('')
  const navigate = useNavigate()
  const { signIn, error, loading, auth } = UseAuth()

  const clearLocalStorage = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('user_token');
  };
  clearLocalStorage();

  function handleAuth() {
    signIn(username, pwd)
  }

  if (auth) {
    setTimeout(() => {
      navigate('/Relatórios-Efetivo')
    }, 1000)
  }

  return (
    <>
      <div className="body-login">
        <div className="logo-container-login">
          <img src={Logo} />
          <h1>SISTEMA DE CONTROLE DE ACESSO</h1>
        </div>
        <div className="card-login">
          <div className="input-container">
            <p>Usuário</p>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-container">
            <p>Senha</p>
            <input value={pwd} onChange={(e) => setPwd(e.target.value)} />
          </div>
          <p className='error-message-login'>{error}</p>
          {loading ? (
            <Loader />
          ) :
            <button onClick={handleAuth}>Entrar</button>
          }
          <p>Consultar dados</p>
        </div>
      </div>
    </>
  )
}

export default login