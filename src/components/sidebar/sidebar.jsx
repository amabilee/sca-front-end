import React, { useState, useEffect } from 'react';
import Logo from '../../assets/sidebar/air-force-logo.svg';
import Sair from '../../assets/sidebar/sair-icon.svg';
import './style-sidebar.css';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../../hooks';

function Sidebar() {
    const { signOut } = UseAuth();
    const [userModules, setUserModules] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        
        const mockData = {
            entity: {
                id: 137,
                usuario: 1000001,
                nivel_acesso: 2,
                flag: false,
                auth: null
            },
            modulos: [
                {
                    id_usuario: 137,
                    id_modulo: 14,
                    Modulo: {
                        id: 14,
                        descricao: "Usuários",
                        link: "/usuarios",
                        icone: "usuario_icon.svg",
                        ordem: 1
                    }
                },
                {
                    id_usuario: 137,
                    id_modulo: 15,
                    Modulo: {
                        id: 15,
                        descricao: "Efetivos",
                        link: "/efetivos",
                        icone: "efetivo_icon.svg",
                        ordem: 2
                    }
                },
                {
                    id_usuario: 137,
                    id_modulo: 16,
                    Modulo: {
                        id: 16,
                        descricao: "Relatórios Efetivos",
                        link: "/relatorio-efetivos",
                        icone: "reports_efetivo_icon.svg",
                        ordem: 3
                    }
                }
            ]
        };
        setUserModules(mockData.modulos);
    }, []);

    const navigationButtons = () => {
        return (
            <div className="nav-container">
                {userModules.map((module) => (
                    <div className="tooltip" key={module.Modulo.id}>
                        <img
                            src={`../../../public/${module.Modulo.icone}`}
                            alt={module.Modulo.descricao}
                            onClick={() => handleModuleClick(module.Modulo.link)}
                        />
                        <span className="tooltiptext">{module.Modulo.descricao}</span>
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
