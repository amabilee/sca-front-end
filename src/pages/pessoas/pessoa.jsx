import { useState} from 'react';
import Header from '../../components/sidebar/sidebar';

import DependenteComponent from '../../components/pessoas/dependente.jsx'
import VisitanteComponent from '../../components/pessoas/visitante.jsx'
import MilitarSemANCrachaComponent from '../../components/pessoas/militar_sem_an_cracha.jsx'
import MilitarSemCadastroComponent from '../../components/pessoas/militar_sem_cadastro.jsx'
import CrachaComponent from '../../components/pessoas/cracha.jsx'


import './style.css'

function Pessoas() {
    const [pessoasComponent, setPessoasComponent] = useState({ dependente: true, visitante: false, militar1: false, militar2: false, cracha: false })

    //NAV click handle
    const [styleNav, setStyleNav] = useState(
        {
            button1: 'active-button',
            button2: 'inactive-button',
            button3: 'inactive-button',
            button4: 'inactive-button',
            button5: 'inactive-button'
        })

    const navClick = (type) => {
        switch (type) {
            case 'dependente':
                setStyleNav({ button1: 'active-button', button2: 'inactive-button', button3: 'inactive-button', button4: 'inactive-button', button5: 'inactive-button' })
                setPessoasComponent({ dependente: true, visitante: false, militar1: false, militar2: false, cracha: false })
                break;
            case 'visitante':
                setStyleNav({ button1: 'inactive-button', button2: 'active-button', button3: 'inactive-button', button4: 'inactive-button', button5: 'inactive-button' })
                setPessoasComponent({ dependente: false, visitante: true, militar1: false, militar2: false, cracha: false })
                break;
            case 'militar1':
                setStyleNav({ button1: 'inactive-button', button2: 'inactive-button', button3: 'active-button', button4: 'inactive-button', button5: 'inactive-button' })
                setPessoasComponent({ dependente: false, visitante: false, militar1: true, militar2: false, cracha: false })
                break;
            case 'militar2':
                setStyleNav({ button1: 'inactive-button', button2: 'inactive-button', button3: 'inactive-button', button4: 'active-button', button5: 'inactive-button' })
                setPessoasComponent({ dependente: false, visitante: false, militar1: false, militar2: true, cracha: false })
                break;
            case 'cracha':
                setStyleNav({ button1: 'inactive-button', button2: 'inactive-button', button3: 'inactive-button', button4: 'inactive-button', button5: 'active-button' })
                setPessoasComponent({ dependente: false, visitante: false, militar1: false, militar2: false, cracha: true })
                break;
            default:
                setStyleNav({ button1: 'active-button', button2: 'inactive-button', button3: 'inactive-button', button4: 'inactive-button', button5: 'inactive-button' })
                setPessoasComponent({ dependente: false, visitante: false, militar1: false, militar2: false, cracha: false })
                break;
        }
    }

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title">
                    <h1>Controle de pessoas</h1>
                    <h2>Selecione a categoria que deseja utilizar</h2>
                </div>
                <div className="page-content-pessoas">
                    <div className="nav-pessoas">
                        <button className={styleNav.button1} onClick={() => navClick('dependente')}>Dependentes</button>
                        <button className={styleNav.button2} onClick={() => navClick('visitante')}>Visitantes</button>
                        <button className={styleNav.button3} onClick={() => navClick('militar1')}>Militar sem AN/Crachá</button>
                        <button className={styleNav.button4} onClick={() => navClick('militar2')}>Militar sem cadastro</button>
                        <button className={styleNav.button5} onClick={() => navClick('cracha')}>Crachás</button>
                    </div>
                    {pessoasComponent.dependente ? (
                        <DependenteComponent />
                    ) : pessoasComponent.visitante ? (
                        <VisitanteComponent />
                    ) : pessoasComponent.militar1 ? (
                        <MilitarSemANCrachaComponent />
                    ) : pessoasComponent.militar2 ? (
                        <MilitarSemCadastroComponent />
                    ) : pessoasComponent.cracha ? (
                        <CrachaComponent/>
                    ) : null}
                </div>
            </div>
        </div >
    );
}

export default Pessoas;
