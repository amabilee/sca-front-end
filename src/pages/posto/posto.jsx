import React, { useState, useEffect } from 'react';
import Header from '../../components/sidebar/sidebar';
import PostosTable from '../../components/tables/postos';
import '../relatorio/style.css';
import '../posto/style.css';
import EditPostoModal from '../../components/modals/edit/posto';
import DeletePostoModal from '../../components/modals/delete/posto';
import CreatePostoModal from '../../components/modals/create/posto';
import { server } from '../../services/server';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Loader from '../../components/loader/index';

function PostoServico() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })
    const [editModal, setOpenEditModal] = useState(false);
    const [createModal, setOpenCreateModal] = useState(false);
    const [deleteModal, setOpenDeleteModal] = useState(false);
    const [sendingPosto, setSendingPosto] = useState({});
    const [nivelAcesso, setNivelAcesso] = useState(1)

    const [loading, setLoading] = useState(true)

    //Paginator conifg
    const handleChange = (event, value) => {
        setPaginationData(prevState => {
            return { ...prevState, currentPage: value }
        });
        getPostos(paginationData.filtering, value)
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
        getPostos('', 1);
    }, []);

    const getPostos = async (filter, page) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        setNivelAcesso(userDataParsed.nivel_acesso)
        try {
            const response = await server.get(`/posto?page=${page}${filter}`, {
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
            setMessage("Erro ao buscar dados:");
            setStatusAlert("error");
        }
    };

    const [registros, setRegistros] = useState([]);

    // Filtering arguments
    const [filteringConditions, setFilteringConditions] = useState({
        nome: '',
        nivel_acesso: 0,
    });

    const sendFilteringConditions = () => {
        let filter = ''
        if (filteringConditions.nome != '') {
            filter += `&nome=${filteringConditions.nome}`
        }
        if (filteringConditions.nivel_acesso != 0) {
            filter += `&nivel_acesso=${filteringConditions.nivel_acesso}`
        }
        getPostos(filter, 1)
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 }
        });
    };

    // Open and Close Modals
    const openModal = (type, data) => {
        switch (type) {
            case 'edit':
                setOpenEditModal(true);
                setSendingPosto(data);
                break;
            case 'create':
                setOpenCreateModal(true);
                break;
            case 'delete':
                setOpenDeleteModal(true)
                setSendingPosto(data);
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
            default:
                break;
        }
        getPostos(paginationData.filtering, paginationData.currentPage);
    };

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                {nivelAcesso == 2 ? (
                    <div className="page-title page-title-create-option">
                        <div className="page-title-text">
                            <h1>Postos de Serviço</h1>
                            <h2>Para consultar os postos, informe os dados desejados</h2>
                        </div>
                        <button onClick={() => openModal("create")}>Cadastrar posto</button>
                    </div>
                ) : (
                    <div className="page-title">
                        <h1>Postos de Serviço</h1>
                        <h2>Para consultar os postos, informe os dados desejados</h2>
                    </div>
                )}
                <div className="page-filters posto-filters">
                    <div className="input-container">
                        <p>Nome do posto</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.nome}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, nome: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Nível de acesso</p>
                        <select
                            value={filteringConditions.nivel_acesso}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, nivel_acesso: e.target.value })}
                            className='filtering-input'
                        >
                            <option value={0}>Nenhum</option>
                            <option value={1}>1</option>
                            <option value={2}>2</option>
                            <option value={3}>3</option>
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
                        <PostosTable data={registros} openModal={openModal} levelAcesso={nivelAcesso} />
                    )}
                    < Stack spacing={2}>
                        <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                    </Stack>
                </div>
            </div>
            {
                editModal && (
                    <EditPostoModal currentPosto={sendingPosto} closeModal={closeModal} renderTable={operationSuccess} />
                )
            }
            {
                createModal && (
                    <CreatePostoModal closeModal={closeModal} renderTable={operationSuccess} />
                )
            }
            {
                deleteModal && (
                    <DeletePostoModal currentPosto={sendingPosto} closeModal={closeModal} renderTable={operationSuccess} />
                )
            }
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

export default PostoServico;
