import React, { useState, useEffect } from 'react';
import Header from '../../components/sidebar/sidebar';
import UsuariosTable from '../../components/tables/usuarios';
import EditUsuarioModal from '../../components/modals/edit/usuario';
import DeleteUsuarioModal from '../../components/modals/delete/usuario';
import CreateUsuarioModal from '../../components/modals/create/usuário';
import { server } from '../../services/server';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { IMaskInput } from "react-imask";

function Usuarios() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })
    const [editModal, setOpenEditModal] = useState(false);
    const [createModal, setOpenCreateModal] = useState(false);
    const [deleteModal, setOpenDeleteModal] = useState(false);
    const [sendingData, setSendingData] = useState({});

    //Paginator conifg
    const handleChange = (event, value) => {
        setPaginationData(prevState => {
            return { ...prevState, currentPage: value }
        });
        getUsuarios(paginationData.filtering, value)
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
        getUsuarios('', 1);
    }, []);

    const getUsuarios = async (filter, page) => {
        try {
            const response = await server.get(`/usuario?page=${page}${filter}`);
            setRegistros(response.data.entities);
            setPaginationData(prevState => {
                return { ...prevState, totalPages: response.data.pagination.totalPages }
            });
        } catch (e) {
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados:");
            setStatusAlert("error");
        }
    };

    const [registros, setRegistros] = useState([]);

    // Filtering arguments
    const [filteringConditions, setFilteringConditions] = useState({
        nome: '',
        cpf: '',
        modulos: 0,
        nivel_acesso: 0
    });

    const sendFilteringConditions = () => {
        let filter = ''
        if (filteringConditions.nome != '') {
            filter += `&nome=${filteringConditions.nome}`
        }
        if (filteringConditions.nivel_acesso != 0) {
            filter += `&nivel_acesso=${filteringConditions.nivel_acesso}`
        }
        if (filteringConditions.modulos != 0) {
            filter += `&modulos=${filteringConditions.modulos}`
        }
        if (filteringConditions.cpf.length != 0) {
            filter += `&cpf=${filteringConditions.cpf}`
        }
        getUsuarios(filter, 1)
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 }
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
        getUsuarios(paginationData.filtering, paginationData.currentPage);
    };

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title page-title-create-option">
                    <div className="page-title-text">
                        <h1>Usuários</h1>
                        <h2>Para consultar os usuários, informe os dados desejados</h2>
                    </div>
                    <button onClick={() => openModal("create")}>Cadastrar usuário</button>
                </div>
                <div className="page-filters usuarios-filters">
                    <div className="input-container">
                        <p>Nome completo</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.nome}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, nome: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>CPF</p>
                        <IMaskInput
                            type="text"
                            mask="000.000.000-00"
                            className='filtering-input'
                            value={filteringConditions.cpf}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, cpf: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Módulos</p>
                        <select
                            value={filteringConditions.modulos}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, modulos: e.target.value })}
                            className='filtering-input filtering-select-level-access'
                        >
                            <option value={0}>Nenhum</option>
                            <option value={"Relatórios-Efetivo"}>Relatórios de efetivos</option>
                            <option value={"Relatórios-Veículo"}>Relatórios de veículos</option>
                            <option value={"Pessoas-Efetivo"}>Efetivos</option>
                            <option value={"Pessoas-Usuário"}>Usuários</option>
                            <option value={"Postos"}>Postos de serviço</option>
                            <option value={"Unidades"}>Unidades</option>
                            <option value={"Veículos"}>Veículos</option>
                            <option value={"Alertas"}>Alertas</option>
                            <option value={"Crachás"}>Crachás</option>
                            <option value={"Gerência"}>Gerência</option>
                        </select>
                    </div>
                    <div className="input-container">
                        <p>Nível de acesso</p>
                        <select
                            value={filteringConditions.nivel_acesso}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, nivel_acesso: e.target.value })}
                            className='filtering-input filtering-select-level-access'
                        >
                            <option value={0}>Nenhum</option>
                            <option value={1}>Visualizador</option>
                            <option value={2}>Identificador</option>
                        </select>
                    </div>
                    <button className="searchButton" onClick={sendFilteringConditions}>Pesquisar</button>
                </div>
                <div className="page-content-table">
                    <UsuariosTable data={registros} openModal={openModal} />
                    <Stack spacing={2}>
                        <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                    </Stack>
                </div>
            </div>
            {editModal && (
                <EditUsuarioModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {createModal && (
                <CreateUsuarioModal closeModal={closeModal} renderTable={operationSuccess} />
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

export default Usuarios;
