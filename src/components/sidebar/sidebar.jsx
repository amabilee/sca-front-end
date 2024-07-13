import React, { useState } from 'react';
import Logo from '../../assets/sidebar/air-force-logo.svg';
import Relatorio from '../../assets/sidebar/relatorios-icon.svg';
import Pessoas from '../../assets/sidebar/pessoas-icon.svg';
import Sair from '../../assets/sidebar/sair-icon.svg';
import Postos from '../../assets/sidebar/postos-sevico-icon.svg';
import Unidades from '../../assets/sidebar/unidades-icon.svg';
import Veiculos from '../../assets/sidebar/veiculos-icon.svg';
import Alertas from '../../assets/sidebar/alertas-icon.svg';
import Crachas from '../../assets/sidebar/cracha-icon.svg';
import Gerencia from '../../assets/sidebar/gerencia-icon.svg';
import { useNavigate } from 'react-router-dom';
import './style-sidebar.css';

function Sidebar() {
    const [pessoasModal, setPessoasModal] = useState(false);
    const [relatoriosModal, setRelatoriosModal] = useState(false);
    const navigate = useNavigate();

    //Permitted Modules of the logged user
    const [permissionModules, setPermissionModules] = useState(['Relatórios', 'Relatórios-Efetivo', 'Relatórios-Veículo', 'Pessoas', 'Pessoas-Efetivo', 'Pessoas-Usuário', 'Postos', 'Unidades', 'Veículos', 'Alertas', 'Crachás', 'Gerencia']);

    // Render Nav Icons
    const moduleData = [
        { name: 'Relatórios', imgSrc: Relatorio, tooltip: 'Relatório', modalState: relatoriosModal, setModalState: setRelatoriosModal },
        { name: 'Pessoas', imgSrc: Pessoas, tooltip: 'Pessoas', modalState: pessoasModal, setModalState: setPessoasModal },
        { name: 'Postos', imgSrc: Postos, tooltip: 'Postos de Serviço' },
        { name: 'Unidades', imgSrc: Unidades, tooltip: 'Unidades' },
        { name: 'Veículos', imgSrc: Veiculos, tooltip: 'Veículos' },
        { name: 'Alertas', imgSrc: Alertas, tooltip: 'Alertas' },
        { name: 'Crachás', imgSrc: Crachas, tooltip: 'Crachás' },
        { name: 'Gerencia', imgSrc: Gerencia, tooltip: 'Gerencia' },
    ];

    const handleModuleClick = (moduleName) => {
        switch (moduleName) {
            case 'Postos':
                navigate('/Postos')
                break;
            case 'Unidades':
                navigate('/Unidades')
                break;
            case 'Pessoas':
                setPessoasModal(true);
                setRelatoriosModal(false);
                break;
            case 'Relatórios':
                setRelatoriosModal(true);
                setPessoasModal(false);
                break;
            default:
                setPessoasModal(false);
                setRelatoriosModal(false);
                break;
        }
    };

    const handleRelatoriosEfetivoClick = () => {
        setRelatoriosModal(false); 
        navigate('/Relatórios-Efetivo');
    };

    const navigationButtons = () => {
        const modules = moduleData
            .filter(module => permissionModules.includes(module.name))
            .map(module => (
                <div className="tooltip" key={module.name}>
                    <img
                        src={module.imgSrc}
                        alt={module.tooltip}
                        onClick={() => handleModuleClick(module.name)}
                    />
                    <span className="tooltiptext">{module.tooltip}</span>
                </div>
            ));

        if (modules.length > 0) {
            return <div className="nav-container">{modules}</div>;
        } else {
            console.log(permissionModules);
            return null;
        }
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
                        <img src={Sair} alt='Sair' /><span className='tooltiptext'>Sair</span>
                    </div>
                </div>
            </div>
            {pessoasModal && (
                <div className="sideBar-modal" onClick={() => setPessoasModal(false)}>
                    <div className="sideBar-modal-box">
                        <p>Efetivos</p>
                        <p>Usuários</p>
                    </div>
                </div>
            )}
            {relatoriosModal && (
                <div className="sideBar-modal" onClick={() => setRelatoriosModal(false)}>
                    <div className="sideBar-modal-box">
                        {permissionModules.includes('Relatórios-Efetivo') && (
                            <p onClick={handleRelatoriosEfetivoClick}>Efetivos</p>
                        )}
                        {permissionModules.includes('Relatórios-Veículo') && (
                            <p>Veículos</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;
