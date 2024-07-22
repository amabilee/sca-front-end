import React, { useState, useEffect } from 'react';
import Header from '../../components/sidebar/sidebar';
import AlertasTable from '../../components/tables/alertas';
import DeleteAlertaModal from '../../components/modals/delete/alerta';
import CreateAlertaModal from '../../components/modals/create/alerta';
import EditAlertaModal from '../../components/modals/edit/alerta';
import { server } from '../../services/server';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


// Style for general
import "../style.css";
// Style for this specific
import "./style.css"

function Alertas() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })
    const [deleteModal, setOpenDeleteModal] = useState(false);
    const [editModal, setOpenEditModal] = useState(false);
    const [createModal, setOpenCreateModal] = useState(false);
    const [sendingData, setSendingData] = useState({});
    const [nivelAcesso, setNivelAcesso] = useState(1)

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
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData)
        let token = localStorage.getItem("user_token")
        setNivelAcesso(userDataParsed.nivel_acesso)
        try {
            const response = await server.get(`/alerta?page=${page}${filter}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
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
        nome_alerta: '',
    });

    const sendFilteringConditions = () => {
        let filter = '';
        if (filteringConditions.nome_alerta !== '') {
            filter += `&nome_alerta=${filteringConditions.nome_alerta}`;
        }
        if (filteringConditions.cor !== '') {
            filter += `&cor=${filteringConditions.cor}`;
        }
        getAlertas(filter, 1);
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 };
        });
    };

    // Open and Close Modals
    const openModal = (type, data) => {
        switch (type) {
            case 'edit':
                setOpenEditModal(true);
                setSendingData(data);
                break;
            case 'create':
                setOpenCreateModal(true);
                break;
            case 'delete':
                setOpenDeleteModal(true)
                setSendingData(data);
            default:
                break;
        }
    };

    const closeModal = (type) => {
        switch (type) {
            case 'edit':
                setOpenEditModal(false);
                break;
            case 'create':
                setOpenCreateModal(false);
                break;
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
            case 'edit':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Alerta alterado com sucesso.");
                setStatusAlert("success");
                break;
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
                {nivelAcesso && nivelAcesso == 2 && (
                    <div className="page-title page-title-create-option">
                        <div className="page-title-text">
                            <h1>Alertas</h1>
                            <h2>Para consultar os alertas, informe os dados desejados</h2>
                        </div>
                        <button onClick={() => openModal("create")}>Cadastrar alerta</button>
                    </div>
                )}
                {nivelAcesso && nivelAcesso == 1 && (
                    <div className="page-title">
                        <h1>Alertas</h1>
                        <h2>Para consultar os alertas, informe os dados desejados</h2>
                    </div>
                )}
                <div className="page-filters alerta-filters">
                    <div className="input-container">
                        <p>Descrição do alerta</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.nome_alerta}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, nome_alerta: e.target.value })}
                        ></input>
                    </div>
                    <button className="searchButton" onClick={sendFilteringConditions}>Pesquisar</button>
                </div>
                <div className="page-content-table">
                    <AlertasTable data={registros} openModal={openModal} levelAcesso={nivelAcesso}/>
                    <Stack spacing={2}>
                        <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                    </Stack>
                </div>
            </div>
            {deleteModal && (
                <DeleteAlertaModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {createModal && (
                <CreateAlertaModal closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {editModal && (
                <EditAlertaModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
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
