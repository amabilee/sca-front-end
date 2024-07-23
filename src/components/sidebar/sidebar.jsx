import React, { useState, useEffect } from 'react';
import Logo from '../../assets/sidebar/air-force-logo.svg';
import Sair from '../../assets/sidebar/sair-icon.svg';
import './style-sidebar.css';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../hooks';
import { server } from '../../services/server'

function Sidebar() {
    const { signOut } = UseAuth();
    const [userModules, setUserModules] = useState([]);
    const navigate = useNavigate();

    const getUserModulos = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData)
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/usuario/${userDataParsed.id}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setUserModules(response.data.entity[0].Modulos)
        } catch (e) {
            console.log(e)
            if (e.response.status == 401) {
                navigate('/');
                signOut()
            } else {
                console.log(e)
            }
        }
    }

    useEffect(() => {
        getUserModulos()
    }, []);

    const navigationButtons = () => {
        return (
            <div className="nav-container">
                {userModules.map((module) => (
                    <div className="tooltip" key={module.ordem}>
                        <img
                            src={`../../../public/${module.icone}`}
                            alt={module.descricao}
                            onClick={() => handleModuleClick(module.link)}
                        />
                        <span className="tooltiptext">{module.descricao}</span>
                    </div>
                ))}
            </div>
        );
    };

    const logOut = () => {
        signOut();
        navigate('/');
    };

    const handleModuleClick = (link) => {
        navigate(link);
    };

    return (
        <>
            <div className="side-bar-container">
                <div className="air-force-logo-container">
                    <img src={Logo} alt='Logo base aérea' />
                </div>
                {navigationButtons()}
                <div className="exit-container">
                    <div className="tooltip">
                        <img src={Sair} alt='Sair' onClick={logOut} />
                        <span className='tooltiptext'>Sair</span>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
