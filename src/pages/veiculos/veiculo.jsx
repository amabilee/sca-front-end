import React, { useState, useEffect } from 'react';
import Header from '../../components/sidebar/sidebar';
import VeiculosTable from '../../components/tables/veiculos';
import EditVeiculoModal from '../../components/modals/edit/veiculo';
import DeleteVeiculoModal from '../../components/modals/delete/veiculo';
import CreateVeiculoModal from '../../components/modals/create/veiculo';
import InactiveVeiculoModal from '../../components/modals/archived/veiculo';
import { server } from '../../services/server';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Loader from '../../components/loader/index';
import CarIcon from '../../assets/car_icon.svg'

import './style.css'


function Veiculos() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '&ativo_veiculo=true' })
    const [editModal, setOpenEditModal] = useState(false);
    const [createModal, setOpenCreateModal] = useState(false);
    const [deleteModal, setOpenDeleteModal] = useState(false);
    const [inactiveModal, setOpenInactiveModal] = useState(false);
    const [sendingData, setSendingData] = useState({});
    const [nivelAcesso, setNivelAcesso] = useState(1)
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    //Paginator conifg
    const handleChange = (event, value) => {
        setPaginationData(prevState => {
            return { ...prevState, currentPage: value }
        });
        getVeiculos(paginationData.filtering, value)
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
        getVeiculos('&ativo_veiculo=true', 1);
    }, []);

    const getVeiculos = async (filter, page) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        setNivelAcesso(userDataParsed.nivel_acesso)
        try {
            const response = await server.get(`/veiculo?page=${page}${filter}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setRegistros(response.data.formattedEntities);
            setPaginationData(prevState => {
                return { ...prevState, totalPages: response.data.pagination.totalPages }
            });
            setLoading(false)
        } catch (e) {
            if (e.response.status == 401) {
                navigate('/');
                signOut()
            } else {
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Erro ao buscar dados:");
                setStatusAlert("error");
            }
        }
    };

    const [registros, setRegistros] = useState([]);

    // Filtering arguments
    const [filteringConditions, setFilteringConditions] = useState({
        nome_guerra: '',
        tipo: 0,
        cor_veiculo: '',
        placa: '',
        marca: '',
        modelo: '',
        renavam: '',
        qrcode: ''
    });

    const sendFilteringConditions = () => {
        let filter = '&ativo_veiculo=true'
        if (filteringConditions.nome_guerra != '') {
            filter += `&nome_guerra=${filteringConditions.nome_guerra}`
        }
        if (filteringConditions.tipo != 0) {
            filter += `&tipo=${filteringConditions.tipo}`
        }
        if (filteringConditions.cor_veiculo != '') {
            filter += `&cor_veiculo=${filteringConditions.cor_veiculo}`
        }
        if (filteringConditions.placa != '') {
            filter += `&placa=${filteringConditions.placa}`
        }
        if (filteringConditions.marca != '') {
            filter += `&marca=${filteringConditions.marca}`
        }
        if (filteringConditions.modelo != '') {
            filter += `&modelo=${filteringConditions.modelo}`
        }
        if (filteringConditions.renavam != '') {
            filter += `&renavam=${filteringConditions.renavam}`
        }
        if (filteringConditions.qrcode != '') {
            filter += `&qrcode=${filteringConditions.qrcode}`
        }
        getVeiculos(filter, 1)
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
                break;
            case 'inactive':
                setOpenInactiveModal(true);
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
                break;
            case 'inactive':
                setOpenInactiveModal(false)
                operationSuccess()
            default:
                break;
        }
    };

    const operationSuccess = (type) => {
        switch (type) {
            case 'create':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Veículo criado com sucesso.");
                setStatusAlert("success");
                break;
            case 'edit':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Veículo alterado com sucesso.");
                setStatusAlert("success");
                break;
            case 'delete':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Veículo deletado com sucesso.");
                setStatusAlert("success");
            default:
                break;
        }
        getVeiculos(paginationData.filtering, paginationData.currentPage);
    };

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                {nivelAcesso == 2 ? (
                    <div className="page-title page-title-create-option">
                        <div className="page-title-text">
                            <h1>Veículos</h1>
                            <h2>Para consultar os veículos, informe os dados desejados</h2>
                        </div>
                        <div className="page-title-buttons">
                            <button onClick={() => openModal("inactive")}><img src={CarIcon} />Veículos desativados</button>
                            <button onClick={() => openModal("create")}>Cadastrar veículo</button>
                        </div>
                    </div>
                ) : (
                    <div className="page-title">
                        <h1>Veículos</h1>
                        <h2>Para consultar os veículos, informe os dados desejados</h2>
                    </div>
                )}
                <div className="page-filters veiculo-filters">
                    <div className="input-container">
                        <p>Responsável</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.nome_guerra}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, nome_guerra: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Tipo</p>
                        <select
                            value={filteringConditions.tipo}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, tipo: e.target.value })}
                            className='filtering-input filtering-select-level-access'
                        >
                            <option value={0}>Nenhum</option>
                            <option value={'Motocicleta'}>Motocicleta</option>
                            <option value={'Carro'}>Carro</option>
                            <option value={'Caminhoneta'}>Caminhoneta</option>
                            <option value={'Ônibus'}>Ônibus</option>
                        </select>
                    </div>
                    <div className="input-container">
                        <p>Cor</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.cor_veiculo}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, cor_veiculo: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Placa</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.placa}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, placa: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Marca</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.marca}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, marca: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Modelo</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.modelo}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, modelo: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>RENAVAM</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.renavam}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, renavam: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Selo / AN</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.qrcode}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, qrcode: e.target.value })}
                        />
                    </div>
                    <button className="searchButton" onClick={sendFilteringConditions}>Pesquisar</button>
                </div>
                <div className="page-content-table">
                    {loading ? (
                        <div className="loading-container">
                            <Loader />
                        </div>
                    ) : (
                        <VeiculosTable data={registros} openModal={openModal} levelAcesso={nivelAcesso} />
                    )}
                    <Stack spacing={2}>
                        <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                    </Stack>
                </div>
            </div>
            {editModal && (
                <EditVeiculoModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {createModal && (
                <CreateVeiculoModal closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {deleteModal && (
                <DeleteVeiculoModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
            )}
            {inactiveModal && (
                <InactiveVeiculoModal currentData={sendingData} closeModal={closeModal} renderTable={operationSuccess} />
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

export default Veiculos;
