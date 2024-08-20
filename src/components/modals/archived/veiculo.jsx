import { useState, useEffect } from 'react';
import { server } from '../../../services/server';
import VeiculosTable from '../../tables/veiculos';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import Loader from '../../loader/index';

import PropTypes from 'prop-types';

export default function Veiculos({ closeModal }) {
    const [paginationData, setPaginationData] = useState({ currentPage: 1, totalPages: 0, filtering: '' })
    const [nivelAcesso, setNivelAcesso] = useState(1)
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
        getVeiculos('', 1);
    }, []);

    const getVeiculos = async (filter, page) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        setNivelAcesso(userDataParsed.nivel_acesso)
        try {
            const response = await server.get(`/veiculo?page=${page}&inativo=true${filter}`, {
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
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao buscar dados:");
            setStatusAlert("error");

        }
    };

    const [registros, setRegistros] = useState([]);

    // Filtering arguments
    const [filteringConditions, setFilteringConditions] = useState({
        militar: '',
        tipo: 0,
        cor_veiculo: 'Nenhum',
        placa: '',
        marca: '',
        modelo: '',
        renavam: '',
        qrcode: ''
    });

    const sendFilteringConditions = () => {
        let filter = ''
        if (filteringConditions.militar != '') {
            filter += `&militar=${filteringConditions.militar}`
        }
        if (filteringConditions.tipo != 0) {
            filter += `&tipo=${filteringConditions.tipo}`
        }
        if (filteringConditions.cor_veiculo != 'Nenhum') {
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


    // Modal operations
    const openModal = (type, data) => {
        switch (type) {
            case 'activate':
                activateVeiculo(data)
                break;
            default:
                break;
        }
    };

    const operationSuccess = (type) => {
        switch (type) {
            case 'activate':
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Veículo ativado com sucesso.");
                setStatusAlert("success");
                break;
            default:
                break;
        }
        getVeiculos(paginationData.filtering, paginationData.currentPage);
    };

    // Activate Veiculo req

    const activateVeiculo = async (veiculo) => {
        let removeData = { ...veiculo, ativo_veiculo: true }
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        setNivelAcesso(userDataParsed.nivel_acesso)
        try {
            await server.put(`/veiculo/${Number(veiculo.id)}`, removeData, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            operationSuccess('activate');
        } catch (e) {
            setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
            setMessage("Erro ao ativar veículo:");
            setStatusAlert("error");

        }
    }


    return (
        <>
            <div className="page-container modal">
                {nivelAcesso == 2 ? (
                    <div className="page-title page-title-create-option">
                        <div className="page-title-text">
                            <h1>Veículos desativados</h1>
                            <h2>Para consultar os veículos desativados, informe os dados desejados</h2>
                        </div>
                        <button onClick={() => closeModal('inactive')}>Voltar</button>
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
                            value={filteringConditions.militar}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, militar: e.target.value })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Tipo</p>
                        <select
                            value={filteringConditions.tipo}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, tipo: e.target.value })}
                            className='filtering-input'
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
                        <select
                            className='filtering-input'
                            value={filteringConditions.cor_veiculo}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, cor_veiculo: e.target.value })}
                        >
                            <option value={'Nenhum'}>Nenhum</option>
                            <option value={'Amarelo'}>Amarelo</option>
                            <option value={'Azul'}>Azul</option>
                            <option value={'Bege'}>Bege</option>
                            <option value={'Branca'}>Branca</option>
                            <option value={'Cinza'}>Cinza</option>
                            <option value={'Dourada'}>Dourada</option>
                            <option value={'Grená'}>Grená</option>
                            <option value={'Laranja'}>Laranja</option>
                            <option value={'Marrom'}>Marrom</option>
                            <option value={'Prata'}>Prata</option>
                            <option value={'Preta'}>Preta</option>
                            <option value={'Rosa'}>Rosa</option>
                            <option value={'Roxa'}>Roxa</option>
                            <option value={'Verde'}>Verde</option>
                            <option value={'Vermelha'}>Vermelha</option>
                            <option value={'Fantasia'}>Fantasia</option>
                        </select>
                    </div>
                    <div className="input-container">
                        <p>Placa</p>
                        <input
                            type='text'
                            maxLength={7}
                            className='filtering-input'
                            value={filteringConditions.placa}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, placa: e.target.value.replace(/[^a-zA-Z0-9]/g, "") })}
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
                            type='text'
                            maxLength={11}
                            className='filtering-input'
                            value={filteringConditions.renavam}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, renavam: e.target.value.replace(/[^0-9]/g, "") })}
                        />
                    </div>
                    <div className="input-container">
                        <p>Selo / AN</p>
                        <input
                            type='text'
                            maxLength={5}
                            className='filtering-input'
                            value={filteringConditions.qrcode}
                            onChange={(e) => setFilteringConditions({ ...filteringConditions, qrcode: e.target.value.replace(/[^0-9]/g, "") })}
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
                        <VeiculosTable data={registros} levelAcesso={nivelAcesso} archived={true} openModal={openModal} />
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
        </>
    );
}

Veiculos.propTypes = {
    closeModal: PropTypes.func.isRequired,
};