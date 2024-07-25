import React, { useState } from 'react'
import Header from '../../components/sidebar/sidebar'
import RelatoriosVeiculosTable from '../../components/tables/relatorio-veiculo'
import './style.css'

import { DateRangePicker } from 'rsuite';
import { FaCalendar } from 'react-icons/fa';
import 'rsuite/dist/rsuite.min.css';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Loader from '../../components/loader/index';

function RelatorioVeiculo() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1, filtering: '' })
    const [loading, setLoading] = useState(false)
    const [registros, setRegistros] = useState([
        {
            tipo: "Entrada",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Entrada",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Entrada",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Entrada",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Entrada",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Entrada",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Saída",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Saída",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Saída",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Saída",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Saída",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Saída",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        },
        {
            tipo: "Saída",
            data: "12/34/5678",
            adesivo: "12345",
            hora: "12:34",
            placa: "QWE1234",
            sentinela: "Cb MARQUES"
        }
    ])

    //Paginator conifg
    const handleChange = (event, value) => {
        setPaginationData(prevState => {
            return { ...prevState, currentPage: value }
        });
        getAlertas(paginationData.filtering, value)
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
        adesivo: '',
        placa: '',
        data: []

    });

    const sendFilteringConditions = () => {
        let filter = ''
        if (filteringConditions.militar != '') {
            filter += `&militar=${filteringConditions.militar}`
        }
        if (filteringConditions.data.length != 0) {
            filter += `&data=${filteringConditions.data}`
        }
        // getUnidades(filter, 1)
        // setPaginationData(prevState => {
        //     return { ...prevState, filtering: filter, currentPage: 1 }
        // });
        console.log(filter)
        console.log(filteringConditions)
    };



    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title">
                    <h1>Registros de entrada e saída - Veículos</h1>
                    <h2>Para consultar os registros, informe os dados desejados</h2>
                </div>
                <div className="page-filters filters-relatorio-veiculo">
                    <div className="input-container">
                        <p>Adesivo/Selo</p>
                        <input className='filtering-input' value={filteringConditions.adesivo} onChange={(e) => setFilteringConditions({ ...filteringConditions, adesivo: e.target.value })} />
                    </div>
                    <div className="input-container">
                        <p>Placa</p>
                        <input className='filtering-input' value={filteringConditions.placa} onChange={(e) => setFilteringConditions({ ...filteringConditions, placa: e.target.value })} />
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
                        <RelatoriosVeiculosTable data={registros} />
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

export default RelatorioVeiculo