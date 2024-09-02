import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/sidebar/sidebar';
import { server } from '../../services/server';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import DependenteComponent from '../../components/pessoas/dependente.jsx'
import VisitanteComponent from '../../components/pessoas/visitante.jsx'
import MilitarSemANCrachaComponent from '../../components/pessoas/militar_sem_an_cracha.jsx'
import MilitarSemCadastroComponent from '../../components/pessoas/militar_sem_cadastro.jsx'
import CrachaComponent from '../../components/pessoas/cracha.jsx'


import './style.css'

function Pessoas() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })
    const [pessoasComponent, setPessoasComponent] = useState({ dependente: true, visitante: false, militar1: false, militar2: false, cracha: false })

    // SnackBar config
    const [message, setMessage] = useState("");
    const [statusAlert, setStatusAlert] = useState("");
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const getPostos = useCallback(async (filter, page) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/posto?page=${page}${filter}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setPaginationData(prevState => {
                return { ...prevState, totalPages: response.data.pagination.totalPages }
            });
        } catch (e) {
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados:");
            setStatusAlert("error");
        }
    }, [state, setPaginationData, setState, setMessage, setStatusAlert]);

    useEffect(() => {
        getPostos('', 1);
    }, [getPostos]);

    const operationSuccess = (type) => {
        switch (type) {
            case 'create':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Posto de Serviço criado com sucesso.");
                setStatusAlert("success");
                break;
            case 'edit':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Posto de Serviço alterado com sucesso.");
                setStatusAlert("success");
                break;
            case 'delete':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Posto de Serviço deletado com sucesso.");
                setStatusAlert("success");
                break;
            default:
                break;
        }
        getPostos(paginationData.filtering, paginationData.currentPage);
    };

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
                        <DependenteComponent renderTable={operationSuccess} />
                    ) : pessoasComponent.visitante ? (
                        <VisitanteComponent renderTable={operationSuccess} />
                    ) : pessoasComponent.militar1 ? (
                        <MilitarSemANCrachaComponent renderTable={operationSuccess} />
                    ) : pessoasComponent.militar2 ? (
                        <MilitarSemCadastroComponent renderTable={operationSuccess} />
                    ) : pessoasComponent.cracha ? (
                        <CrachaComponent renderTable={operationSuccess}></CrachaComponent>
                    ) : null}
                </div>
            </div>
            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity={statusAlert}>
                    {message}
                </Alert>
            </Snackbar>
        </div >
    );
}

export default Pessoas;
