import React, { useState, useEffect } from 'react';
import Header from '../../components/sidebar/sidebar';
import EfetivosTable from '../../components/tables/efetivos';
import EditEfetivoModal from '../../components/modals/edit/efetivo';
import DeleteEfetivoModal from '../../components/modals/delete/efetivo';
import CreateEfetivoModal from '../../components/modals/create/efetivo';
import { server } from '../../services/server';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Loader from '../../components/loader/index';

import './style.css'

function Efetivos() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })
    const [deleteModal, setOpenDeleteModal] = useState(false);
    const [editModal, setOpenEditModal] = useState(false);
    const [createModal, setOpenCreateModal] = useState(false);
    const [sendingData, setSendingData] = useState({});
    const [nivelAcesso, setNivelAcesso] = useState(1)

    const [graduacaoOptions, setGraduacaoOptions] = useState([]);
    const [unidadeOptions, setUnidadeOptions] = useState([]);

    const [loading, setLoading] = useState(true)

    //Paginator conifg
    const handleChange = (event, value) => {
        setPaginationData(prevState => {
            return { ...prevState, currentPage: value }
        });
        getEfetivos(paginationData.filtering, value)
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
        getEfetivos('', 1);
        getSelectOptions();
    }, []);

    const getEfetivos = async (filter, page) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData)
        let token = localStorage.getItem("user_token")
        setNivelAcesso(userDataParsed.nivel_acesso)
        try {
            const response = await server.get(`/efetivo?page=${page}${filter}`, {
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
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados");
            setStatusAlert("error");
        }
    };

    const [registros, setRegistros] = useState([]);

    // Filtering arguments
    const [filteringConditions, setFilteringConditions] = useState({
        qrcode_efetivo: '',
        nome_guerra: '',
        nome_completo: '',
        unidade: '',
        graduacao: ''
    });

    const sendFilteringConditions = () => {
        let filter = '';
        if (filteringConditions.qrcode_efetivo !== '') {
            filter += `&qrcode_efetivo=${filteringConditions.qrcode_efetivo}`;
        }
        if (filteringConditions.nome_guerra !== '') {
            filter += `&nome_guerra=${filteringConditions.nome_guerra}`;
        }
        if (filteringConditions.nome_completo !== '') {
            filter += `&nome_completo=${filteringConditions.nome_completo}`;
        }
        if (filteringConditions.graduacao !== '') {
            filter += `&graduacao=${filteringConditions.graduacao}`;
        }
        if (filteringConditions.unidade !== '') {
            filter += `&unidade=${filteringConditions.unidade}`;
        }
        getEfetivos(filter, 1);
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 };
        });
    };

    // Open and Close Modals

    const openModal = async (type, data) => {
        switch (type) {
            case 'edit':
                let userData = localStorage.getItem('user');
                let userDataParsed = JSON.parse(userData);
                let token = localStorage.getItem("user_token");

                let sendData 
                try {
                    const response = await server.get(`/efetivo/${data.id}`, {
                        headers: {
                            'Authentication': token,
                            'access-level': userDataParsed.nivel_acesso
                        }
                    });
                    sendData = response.data;
                } catch (e) {
                    setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                    setMessage("Erro ao buscar dados");
                    setStatusAlert("error");
                }
                setSendingData(sendData);
                setOpenEditModal(true);
                break;
            case 'create':
                setOpenCreateModal(true);
                break;
            case 'delete':
                setOpenDeleteModal(true);
                setSendingData(data);
                break;
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
            case 'create':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Efetivo criado com sucesso.");
                setStatusAlert("success");
                break;
            case 'edit':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Efetivo alterado com sucesso.");
                setStatusAlert("success");
                break;
            case 'delete':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Efetivo deletado com sucesso.");
                setStatusAlert("success");
            default:
                break;
        }
        getEfetivos(paginationData.filtering, paginationData.currentPage);
    };

    //Filtering Options

    const getSelectOptions = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData)
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/graduacao`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setGraduacaoOptions(response.data.entities);
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar graduações.");
            setStatusAlert("error");
        }

        try {
            const response = await server.get(`/unidade`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setUnidadeOptions(response.data.entities);
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar unidades.");
            setStatusAlert("error");
        }
    };

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                {nivelAcesso == 2 ? (
                    <div className="page-title page-title-create-option">
                        <div className="page-title-text">
                            <h1>Efetivos</h1>
                            <h2>Para consultar os efetivos, informe os dados desejados</h2>
                        </div>
                        <button onClick={() => openModal("create")}>Cadastrar efetivo</button>
                    </div>
                ) : (
                    <div className="page-title">
                        <h1>Efetivos</h1>
                        <h2>Para consultar os efetivos, informe os dados desejados</h2>
                    </div>
                )}
                <div className="page-filters efetivo-filters">
                    <div className="input-container">
                        <p>Número de ordem ou documento</p>
                        <input
                            type="text"
                            maxLength={10}
                            className='filtering-input'
                            value={filteringConditions.qrcode_efetivo}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, qrcode_efetivo: e.target.value.replace(/[^0-9]/g, "") })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Posto\Graduação</p>
                        <select
                            value={filteringConditions.graduacao}
                            className='filtering-input'
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, graduacao: e.target.value })}>
                            <option value={''}>Nenhuma</option>
                            {graduacaoOptions.map((modulo, i) => (
                                <option key={i} value={modulo.sigla}>{modulo.sigla}</option>
                            ))}
                        </select>
                    </div>
                    <div className="input-container">
                        <p>Nome de guerra</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.nome_guerra}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, nome_guerra: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Nome completo</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.nome_completo}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, nome_completo: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Unidade</p>
                        <select
                            className='filtering-input'
                            value={filteringConditions.unidade}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, unidade: e.target.value })}>
                            <option value={''}>Nenhuma</option>
                            {unidadeOptions.map((modulo, i) => (
                                <option key={i} value={modulo.nome}>{modulo.nome}</option>
                            ))}
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
                        <EfetivosTable data={registros} openModal={openModal} levelAcesso={nivelAcesso} />
                    )}
                    <Stack spacing={2}>
                        <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                    </Stack>
                </div>
            </div>
            {editModal && (
                <EditEfetivoModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {createModal && (
                <CreateEfetivoModal closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {deleteModal && (
                <DeleteEfetivoModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
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

export default Efetivos;
