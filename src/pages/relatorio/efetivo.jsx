import React, { useState, useEffect } from 'react'
import Header from '../../components/sidebar/sidebar'
import RelatoriosEfetivosTable from '../../components/tables/relatorio-efetivo'
import './style.css'

import { DateRangePicker } from 'rsuite';
import { FaCalendar } from 'react-icons/fa';
import 'rsuite/dist/rsuite.min.css';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Loader from '../../components/loader/index';

import { server } from '../../services/server';

function RelatorioEfetivo() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1, filtering: '' })
    const [loading, setLoading] = useState(false)
    const [registros, setRegistros] = useState([])
    const [postosOptions, setPostosOptions] = useState([]);

    //Paginator conifg
    const handleChange = (event, value) => {
        setPaginationData(prevState => {
            return { ...prevState, currentPage: value }
        });
        getRegistros(paginationData.filtering, value)
    };

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

    const [filteringConditions, setFilteringConditions] = useState({
        tipo: 'Nenhum',
        pessoa_militar: '',
        data: [],
        id_posto: 'Nenhum',
        sentinela_autorizador: ''
    });

    const sendFilteringConditions = () => {
        let filter = ''
        if (filteringConditions.tipo !== 'Nenhum') {
            filter += `&tipo=${filteringConditions.tipo}`
        }
        if (filteringConditions.pessoa_militar !== '') {
            filter += `&pessoa_militar=${filteringConditions.pessoa_militar}`
        }
        if (filteringConditions.id_posto !== 'Nenhum') {
            filter += `&id_posto=${filteringConditions.id_posto}`
        }
        if (Array.isArray(filteringConditions.data) && filteringConditions.data.length === 2) {
            const [startDate, endDate] = filteringConditions.data;
            const formattedStartDate = formatDateWithTime(new Date(startDate));
            const formattedEndDate = formatDateWithTime(new Date(endDate));
            filter += `&data=${formattedStartDate},${formattedEndDate}`;
        }
        if (filteringConditions.sentinela_autorizador !== '') {
            filter += `&sentinela_autorizador=${filteringConditions.sentinela_autorizador}`;
        }
        getRegistros(filter, 1)
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 }
        });
    };

    const formatDateWithTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
    
        return `${year}-${month}-${day}%20${hours}:${minutes}:${seconds}`;
    };

    // Data from the DB
    useEffect(() => {
        getRegistros('', 1);
        getSelectOptions()
    }, []);

    const getRegistros = async (filter, page) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")

        try {
            const response = await server.get(`/registro_acesso?page=${page}${filter}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setRegistros(response.data.entities);
            setPaginationData(prevState => {
                return { ...prevState, totalPages: response.data.pagination.totalPages }
            });
            setLoading(false)
        } catch (e) {
            console.log(e)
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados:");
            setStatusAlert("error");
        }
    };


    //Filtering Options

    const getSelectOptions = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData)
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/posto`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setPostosOptions(response.data.entities);
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar postos de serviço.");
            setStatusAlert("error");
        }
    };

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title">
                    <h1>Registros de entrada e saída - Pessoas</h1>
                    <h2>Para consultar os registros, informe os dados desejados</h2>
                </div>
                <div className="page-filters filters-relatorio-efetivo">
                    <div className="input-container">
                        <p>Tipo</p>
                        <select
                            className='filtering-input'
                            value={filteringConditions.tipo}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, tipo: e.target.value })}
                        >
                            <option value={'Nenhum'}>Nenhum</option>
                            <option value={'Entrada'}>Entrada</option>
                            <option value={'Saída'}>Saída</option>
                        </select>
                    </div>
                    <div className="input-container">
                        <p>Posto de serviço</p>
                        <select
                            className='filtering-input'
                            value={filteringConditions.id_posto}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, id_posto: e.target.value })}
                        >
                            <option value={'Nenhum'}>Nenhum</option>
                            {postosOptions.map((posto, i) => (
                                <option key={i} value={posto.id}>{posto.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <p>Pessoa/Militar</p>
                        <input className='filtering-input' placeholder={'Nome/Cpf/Saram'} value={filteringConditions.pessoa_militar} onChange={(e) => setFilteringConditions({ ...filteringConditions, pessoa_militar: e.target.value })} />
                    </div>
                    <div className="input-container">
                        <p>Sentinela/Autorizador</p>
                        <input
                            className='filtering-input'
                            placeholder={'Graduação/Guerra'}
                            value={filteringConditions.sentinela_autorizador}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, sentinela_autorizador: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Intervalo de tempo</p>
                        <DateRangePicker
                            value={filteringConditions.data}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, data: e })}
                            format="dd/MM/yyyy (HH:mm:ss)"
                            showMeridian
                            caretAs={FaCalendar} />
                    </div>
                    <button className="searchButton" onClick={sendFilteringConditions}>Pesquisar</button>
                </div>
                <div className="page-content-table">
                    {loading ? (
                        <div className="loading-container">
                            <Loader />
                        </div>
                    ) : (
                        <RelatoriosEfetivosTable data={registros} />
                    )}
                    < Stack spacing={2}>
                        <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                    </Stack>
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
    )
}

export default RelatorioEfetivo