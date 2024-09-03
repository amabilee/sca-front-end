import { useState, useEffect, useCallback } from 'react'
import { server } from '../../services/server'
import './style.css'
import Loader from '../../components/loader/index';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import CrachasTable from '../tables/crachas.jsx'

function CrachaComponent() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1, filtering: '' })
    const [loading, setLoading] = useState(false)
    const [crachas, setCrachas] = useState([])

    //Paginator conifg
    const handleChange = (event, value) => {
        setPaginationData(prevState => {
            return { ...prevState, currentPage: value }
        });
        getCrachas(paginationData.filtering, value)
    };
    // SnackBar config
    const [message, setMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('')
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    //Filter config

    const [filteringConditions, setFilteringConditions] = useState({
        numero: '',
        tipo: 'Nenhum'
    });

    const sendFilteringConditions = () => {
        let filter = '&ativo=true'
        if (filteringConditions.numero !== '') {
            filter += `&numero=${filteringConditions.numero}`
        }
        if (filteringConditions.tipo !== 'Nenhum') {
            filter += `&tipo=${filteringConditions.tipo}`
        }
        getCrachas(filter, 1)
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 }
        });
    };


    //Get Crachas from DB

    const getCrachas = useCallback(async (filter, page) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")

        try {
            const response = await server.get(`/cracha?page=${page}${filter}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setCrachas(response.data.entities);
            setPaginationData(prevState => {
                return { ...prevState, totalPages: response.data.pagination.totalPages }
            });
            setLoading(false)
        } catch (e) {
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados");
            setAlertSeverity("error");
        }
    }, [state, setCrachas, setPaginationData, setLoading, setState, setMessage, setAlertSeverity]);


    const actionCracha = (type, data) => {
        switch (type) {
            case 'delete':
                let formattedNewRegistro = formatRegistro(data)
                sendRegistroSaida(data, formattedNewRegistro)
                operationSuccess('delete')
                break;
            default:
                break;
        }
    };

    const operationSuccess = (type) => {
        switch (type) {
            case 'delete':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Status do crachá atualizado com sucesso.");
                setAlertSeverity("success");
                break;
            default:
                break;
        }
        getCrachas(paginationData.filtering, paginationData.currentPage);
    };


    useEffect(() => {
        getCrachas('', 1);
    }, []);

    const isObjectEmpty = (obj) => {
        if (!obj) return true;
        return Object.keys(obj).length === 0;
    };

    const getFormattedDateTime = () => {
        const date = new Date();
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        const formattedDate = `${year}/${month}/${day}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
    
        return { formattedDate, formattedTime };
      };

    const formatRegistro = (data) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);

        let typeOfRegistroVeiculo = !isObjectEmpty(data.UltimoRegistroAcessoVeiculo)
        let typeOfRegistroPessoal = !isObjectEmpty(data.UltimoRegistroAcessoPessoa)
        const { formattedDate, formattedTime } = getFormattedDateTime();

        if (typeOfRegistroPessoal) {
            let formRegistro
            if (data.veiculo == 1) {
                formRegistro = {
                    tipo: 'Saída',
                    data:formattedDate,
                    hora:formattedTime,
                    id_posto: data.UltimoRegistroAcessoVeiculo[0].id_posto,
                    cracha_veiculo: data.veiculo == 1 ? data.numero_cracha : null,
                    id_veiculo: data.UltimoRegistroAcessoVeiculo[0].id_veiculo != null ? data.UltimoRegistroAcessoVeiculo[0].id_veiculo : null,
                    id_veiculo_sem_an: data.UltimoRegistroAcessoVeiculo[0].id_veiculo_sem_an != null ? data.UltimoRegistroAcessoVeiculo[0].id_veiculo_sem_an : null,
                    autorizador: data.UltimoRegistroAcessoVeiculo[0].autorizador != null ? data.UltimoRegistroAcessoVeiculo[0].autorizador : null,
                    sentinela: userDataParsed.usuario,
                    detalhe: data.UltimoRegistroAcessoVeiculo[0].detalhe != null ? data.UltimoRegistroAcessoVeiculo[0].detalhe : null,
                }
            } else if (data.pessoa == 1) {
                formRegistro = {
                    tipo: 'Saída',
                    data:formattedDate,
                    hora:formattedTime,
                    id_posto: data.UltimoRegistroAcessoPessoa[0].id_posto,
                    qrcode: data.UltimoRegistroAcessoPessoa[0].qrcode != null ? data.UltimoRegistroAcessoPessoa[0].qrcode : null,
                    cracha_pessoa: data.pessoa == 1 ? data.numero_cracha : null,
                    id_visitante: data.UltimoRegistroAcessoPessoa[0].id_visitante != null ? data.UltimoRegistroAcessoPessoa[0].id_visitante : null,
                    id_dependente: data.UltimoRegistroAcessoPessoa[0].id_dependente != null ? data.UltimoRegistroAcessoPessoa[0].id_dependente : null,
                    autorizador: data.UltimoRegistroAcessoPessoa[0].autorizador != null ? data.UltimoRegistroAcessoPessoa[0].autorizador : null,
                    sentinela: userDataParsed.usuario,
                    detalhe: data.UltimoRegistroAcessoPessoa[0].detalhe != null ? data.UltimoRegistroAcessoPessoa[0].detalhe : null,
                }
            }

            return formRegistro
        } else if (typeOfRegistroVeiculo) {
            let formRegistro
            if (data.veiculo == 1) {
                formRegistro = {
                    tipo: 'Saída',
                    data:formattedDate,
                    hora:formattedTime,
                    id_posto: data.UltimoRegistroAcessoVeiculo[0].id_posto,
                    cracha_veiculo: data.veiculo == 1 ? data.numero_cracha : null,
                    id_veiculo: data.UltimoRegistroAcessoVeiculo[0].id_veiculo != null ? data.UltimoRegistroAcessoVeiculo[0].id_veiculo : null,
                    id_veiculo_sem_an: data.UltimoRegistroAcessoVeiculo[0].id_veiculo_sem_an != null ? data.UltimoRegistroAcessoVeiculo[0].id_veiculo_sem_an : null,
                    autorizador: data.UltimoRegistroAcessoVeiculo[0].autorizador != null ? data.UltimoRegistroAcessoVeiculo[0].autorizador : null,
                    sentinela: userDataParsed.usuario,
                    detalhe: data.UltimoRegistroAcessoVeiculo[0].detalhe != null ? data.UltimoRegistroAcessoVeiculo[0].detalhe : null,
                }
            } else if (data.pessoa == 1) {
                formRegistro = {
                    tipo: 'Saída',
                    data:formattedDate,
                    hora:formattedTime,
                    id_posto: data.UltimoRegistroAcessoPessoa[0].id_posto,
                    qrcode: data.UltimoRegistroAcessoPessoa[0].qrcode != null ? data.UltimoRegistroAcessoPessoa[0].qrcode : null,
                    cracha_pessoa: data.pessoa == 1 ? data.numero_cracha : null,
                    id_visitante: data.UltimoRegistroAcessoPessoa[0].id_visitante != null ? data.UltimoRegistroAcessoPessoa[0].id_visitante : null,
                    id_dependente: data.UltimoRegistroAcessoPessoa[0].id_dependente != null ? data.UltimoRegistroAcessoPessoa[0].id_dependente : null,
                    autorizador: data.UltimoRegistroAcessoPessoa[0].autorizador != null ? data.UltimoRegistroAcessoPessoa[0].autorizador : null,
                    sentinela: userDataParsed.usuario,
                    detalhe: data.UltimoRegistroAcessoPessoa[0].detalhe != null ? data.UltimoRegistroAcessoPessoa[0].detalhe : null,
                }
            }

            return formRegistro
        }
    }

    const sendRegistroSaida = async (registro, formattedRegistro) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")

        console.log(registro, 'inicial')
        console.log(formattedRegistro, 'final')

        try {

            console.log(token, userDataParsed.nivel_acesso)

            const response = await server.post(`/registro_acesso`, formattedRegistro, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });

            if (response) {

                let crachaForm = {
                    ativo_cracha: false
                }

                try {
                    await server.put(`/cracha/${registro.numero_cracha}`, crachaForm, {
                        headers: {
                            'Authentication': token,
                            'access-level': userDataParsed.nivel_acesso
                        }
                    });

                    setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                    setMessage("Crachá e Registro atualizados com sucesso.");
                    setAlertSeverity("success");
                    getCrachas(paginationData.filtering, paginationData.currentPage);
                } catch (e) {
                    setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                    setMessage("Erro ao buscar dados");
                    setAlertSeverity("error");
                }
            } else {
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Erro ao buscar dados");
                setAlertSeverity("error");
            }
        } catch (e) {
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados");
            setAlertSeverity("error");
        }
    }


    return (
        <div className="pessoas-container">
            <div className="pessoas-section-title">
                <h3>Gerênciar crachás</h3>
                <p>Finalize os crachás que foram retornados</p>
            </div>
            <div className="page-filters cracha-filters">
                <div className="input-container">
                    <p>Número do Crachá</p>
                    <input
                        className='filtering-input'
                        value={filteringConditions.numero}
                        onChange={(e) => setFilteringConditions({ ...filteringConditions, numero: e.target.value })}
                    />
                </div>
                <div className="input-container">
                    <p>Tipo do crachá</p>
                    <select
                        className='filtering-input'
                        value={filteringConditions.tipo}
                        onChange={(e) => setFilteringConditions({ ...filteringConditions, tipo: e.target.value })}
                    >
                        <option value={'Nenhum'}>Nenhum</option>
                        <option value={'pessoa'}>Pessoal</option>
                        <option value={'veiculo'}>Veicular</option>
                    </select>
                </div>
                <button className="searchButton" onClick={sendFilteringConditions}>Pesquisar</button>
            </div>
            <div className="page-content-table">
                {loading ? (
                    <div className="loading-container">
                        <Loader />
                    </div>
                ) : (
                    <CrachasTable data={crachas} openModal={actionCracha} />
                )}
                < Stack spacing={2}>
                    <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                </Stack>
            </div>

            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity={alertSeverity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>

    )
}

export default CrachaComponent