import React, { useState, useEffect } from 'react';
import Header from '../../components/sidebar/sidebar';
import UsuariosTable from '../../components/tables/usuarios';
import { server } from '../../services/server';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Loader from '../../components/loader/index';

import './style.css'

import '../style.css'

function Usuarios() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })

    const [loading, setLoading] = useState(true)

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
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/usuario?page=${page}${filter}`, {
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
        militar: '',
        nivel_acesso: 0
    });

    const sendFilteringConditions = () => {
        let filter = ''
        if (filteringConditions.militar != '') {
            filter += `&militar=${filteringConditions.militar}`
        }
        if (filteringConditions.nivel_acesso != 0) {
            filter += `&nivel_acesso=${filteringConditions.nivel_acesso}`
        }
        getUsuarios(filter, 1)
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 }
        });
    };

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title">
                    <h1>Usuários</h1>
                    <h2>Para consultar os usuários, informe os dados desejados</h2>
                </div>
                <div className="page-filters usuarios-filters">
                    <div className="input-container">
                        <p>Militar</p>
                        <input
                            className='filtering-input'
                            value={filteringConditions.militar}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, militar: e.target.value })}
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
                            <option value={1}>Visualizador</option>
                            <option value={2}>Identificador</option>
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
                        <UsuariosTable data={registros} />
                    )}
                    <Stack spacing={2}>
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
        </div>
    );
}

export default Usuarios;
