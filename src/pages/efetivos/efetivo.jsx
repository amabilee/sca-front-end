import React, { useState, useEffect } from 'react';
import Header from '../../components/sidebar/sidebar';
import EfetivosTable from '../../components/tables/efetivos';
import EditUsuarioModal from '../../components/modals/edit/usuario';
import DeleteUsuarioModal from '../../components/modals/delete/usuario';
import CreateEfetivoModal from '../../components/modals/create/efetivo';
import { server } from '../../services/server';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';


function Efetivos() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })
    const [deleteModal, setOpenDeleteModal] = useState(false);
    const [editModal, setOpenEditModal] = useState(false);
    const [createModal, setOpenCreateModal] = useState(false);
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
        numero_ordem: '',
        nome_guerra: '',
        nome_completo: '',
        unidade: '',
        posto_graduacao: ''
    });

    const sendFilteringConditions = () => {
        let filter = '';
        if (filteringConditions.categoria !== 'Nenhum') {
            filter += `&categoria=${filteringConditions.categoria}`;
        }
        if (Array.isArray(filteringConditions.data) && filteringConditions.data.length > 0) {
            filter += `&data=${filteringConditions.data}`;
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
            case 'create':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Usuário criado com sucesso.");
                setStatusAlert("success");
                break;
            case 'edit':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Usuário alterado com sucesso.");
                setStatusAlert("success");
                break;
            case 'delete':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Usuário deletado com sucesso.");
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
                <div className="page-title page-title-create-option">
                    <div className="page-title-text">
                        <h1>Efetivos</h1>
                        <h2>Para consultar os efetivos, informe os dados desejados</h2>
                    </div>
                    <button onClick={() => openModal("create")}>Cadastrar efetivo</button>
                </div>
                <div className="page-filters efetivo-filters">
                    <div className="input-container">
                        <p>Número de ordem</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.numero_ordem}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, numero_ordem: e.target.value })}
                        />
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
                        <input
                            className='filtering-input'
                            value={filteringConditions.unidade}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, unidade: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Posto\Graduação</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.posto_graduacao}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, posto_graduacao: e.target.value })}
                        />
                    </div>
                    <button className="searchButton" onClick={sendFilteringConditions}>Pesquisar</button>
                </div>
                <div className="page-content-table">
                    <EfetivosTable data={registros} openModal={openModal} />
                    <Stack spacing={2}>
                        <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                    </Stack>
                </div>
            </div>
            {editModal && (
                <EditUsuarioModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {createModal && (
                <CreateEfetivoModal closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {deleteModal && (
                <DeleteUsuarioModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
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
