import { useState, useEffect, useCallback } from 'react'
import { server } from '../../services/server'
import './style.css'
import Loader from '../../components/loader/index';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import CrachasTable from '../tables/crachas.jsx'

function CrachaComponent() {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 1, filtering: '' })
    const [loading, setLoading] = useState(false)
    const [crachas, setCrachas] = useState([])

    //Paginator conifg
    const handleChange = (event, value) => {
        setPaginationData(prevState => {
            return { ...prevState, currentPage: value }
        });
        getCrachas(paginationData.filtering, value)
    };
    // SnackBar config
    const [message, setMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('')
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    //Filter config

    const [filteringConditions, setFilteringConditions] = useState({
        numero: '',
        tipo: '',
        nome: '',
        placa: '',
    });

    const sendFilteringConditions = () => {
        let filter = '&ativo=true'
        if (filteringConditions.numero !== '') {
            filter += `&numero=${filteringConditions.numero}`
        }
        if (filteringConditions.tipo !== 'Nenhum') {
            filter += `&tipo=${filteringConditions.tipo}`
        }
        if (filteringConditions.nome !== '') {
            filter += `&nome=${filteringConditions.nome}`
        }
        if (filteringConditions.placa !== '') {
            filter += `&placa=${filteringConditions.placa}`
        }
        getCrachas(filter, 1)
        setPaginationData(prevState => {
            return { ...prevState, filtering: filter, currentPage: 1 }
        });
    };


    //Get Crachas from DB

    const getCrachas = useCallback(async (filter, page) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")

        try {
            const response = await server.get(`/cracha?page=${page}${filter}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setCrachas(response.data.entities);
            console.log(response.data.entities)
            setPaginationData(prevState => {
                return { ...prevState, totalPages: response.data.pagination.totalPages }
            });
            setLoading(false)
        } catch (e) {
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados");
            setAlertSeverity("error");
        }
    }, [state, setCrachas, setPaginationData, setLoading, setState, setMessage, setAlertSeverity]);

    // Open and Close Modals
    const openModal = (type, data) => {
        switch (type) {
            case 'delete':
                console.log(data)
                operationSuccess('delete')
                break;
            default:
                break;
        }
    };

    const operationSuccess = (type) => {
        switch (type) {
            case 'delete':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Status do crachá atualizado com sucesso.");
                setAlertSeverity("success");
                break;
            default:
                break;
        }
        getCrachas(paginationData.filtering, paginationData.currentPage);
    };


    useEffect(() => {
        getCrachas('', 1);
    }, []);

    return (
        <div className="pessoas-container">
            <div className="pessoas-section-title">
                <h3>Gerênciar Crachás</h3>
                <p>Finalize os crachás que foram retornados</p>
            </div>

            <div className="page-content-table">
                {loading ? (
                    <div className="loading-container">
                        <Loader />
                    </div>
                ) : (
                    <CrachasTable data={crachas} openModal={openModal}/>
                )}
                < Stack spacing={2}>
                    <Pagination count={paginationData.totalPages} page={paginationData.currentPage} onChange={handleChange} shape="rounded" />
                </Stack>
            </div>

            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity={alertSeverity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>

    )
}

export default CrachaComponent