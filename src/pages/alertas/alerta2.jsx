import React, { useState, useEffect } from 'react';
import Header from '../../components/sidebar/sidebar';
import AlertasTable from '../../components/tables/alertas';
import DeleteAlertaModal from '../../components/modals/delete/alerta';
import { server } from '../../services/server';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import { DateRangePicker } from 'rsuite';
import { FaCalendar } from 'react-icons/fa';
import 'rsuite/dist/rsuite.min.css';

function Alertas() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })
    const [deleteModal, setOpenDeleteModal] = useState(false);
    const [sendingData, setSendingData] = useState({});

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

    // Data from the DB
    useEffect(() => {
        getAlertas('', 1);
    }, []);

    const getAlertas = async (filter, page) => {
        console.log(page, filter)
        try {
            const response = await server.get(`/alerta?page=${page}${filter}`);
            setRegistros(response.data.entities);
            setPaginationData(prevState => {
                return { ...prevState, totalPages: response.data.pagination.totalPages }
            });
        } catch (e) {
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados");
            setStatusAlert("error");
        }
    };

    const [registros, setRegistros] = useState([]);

    // Filtering arguments
    const [filteringConditions, setFilteringConditions] = useState({
        descricao: '',
        cor: ''
    });

    const sendFilteringConditions = () => {
        let filter = '';
        if (filteringConditions.descricao !== '') {
            filter += `&descricao=${filteringConditions.descricao}`;
        }
        if (filteringConditions.cor !== '') {
            filter += `&cor=${filteringConditions.cor}`;
        }
        getAlertas(filter, 1);
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 };
        });
        console.log(filteringConditions)
    };

    // Open and Close Modals
    const openModal = (type, data) => {
        switch (type) {
            case 'delete':
                setOpenDeleteModal(true)
                setSendingData(data);
            default:
                break;
        }
    };

    const closeModal = (type) => {
        switch (type) {
            case 'delete':
                setOpenDeleteModal(false)
            default:
                break;
        }
    };

    const operationSuccess = (type) => {
        switch (type) {
            case 'delete':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Alerta deletado com sucesso.");
                setStatusAlert("success");
            default:
                break;
        }
        getAlertas(paginationData.filtering, paginationData.currentPage);
    };

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title">
                    <h1>Alertas do sistema</h1>
                    <h2>Para consultar os alertas, informe os dados desejados</h2>
                </div>
                <div className="page-filters alerta-filters">
                    <div className="input-container">
                        <p>Categoria</p>
                        <select
                            className='filtering-input filtering-select-level-access'
                            value={filteringConditions.descricao}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, descricao: e.target.value })}
                        >
                            <option value={'Nenhum'}>Nenhum</option>
                            <option value={'Erro'}>Erro</option>
                            <option value={'Sucesso'}>Sucesso</option>
                        </select>
                    </div>
                    <div className="input-container date-range-container">
                        <p>Intervalo de tempo</p>
                        <DateRangePicker
                            value={filteringConditions.cor}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, cor: e })}
                            format="dd/MM/yyyy (HH:mm:ss)"
                            showMeridian
                            caretAs={FaCalendar} />
                    </div>
                    <button className="searchButton" onClick={sendFilteringConditions}>Pesquisar</button>
                </div>
                <div className="page-content-table">
                    <AlertasTable data={registros} openModal={openModal} />
                    <Stack spacing={2}>
                        <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                    </Stack>
                </div>
            </div>
            {deleteModal && (
                <DeleteAlertaModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
            )}
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
        </div>
    );
}

export default Alertas;
