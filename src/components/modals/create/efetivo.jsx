import React, { useEffect, useState, useRef } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server'
import { IMaskInput } from "react-imask";
import Remove from '../../../assets/remove_icon.svg'
import uploadIcon from '../../../assets/upload.svg'

export default function CreateEfetivoModal({ closeModal, renderTable }) {
    const [graduacaoOptions, setGraduacaoOptions] = useState([])
    const [unidadeOptions, setUnidadeOptions] = useState([])
    const [situacaoOptions, setSituacaoOptions] = useState([])
    const [efetivoFoto, setEfetivoFoto] = useState("")
    const [graduacaoSelected, setGraduacaoSelected] = useState("")
    const [receivedData, setReceivedData] = useState(
        {
            qrcode_efetivo: '',
            nome_guerra: '',
            nome_completo: '',
            id_unidade: 0,
            id_graduacao: 0,
            email: '',
            id_alerta: 0,
            email: '',
            cnh: '',
            val_cnh: '',
            foto: '',
            ativo_efetivo: true
        })

    // SnackBar config
    const [message, setMessage] = useState("");
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const cleanInputs = () => {
        setReceivedData({
            ...receivedData,
            qrcode_efetivo: '',
            nome_guerra: '',
            nome_completo: '',
            id_unidade: 0,
            id_graduacao: 0,
            email: '',
            id_alerta: 0,
            email: '',
            cnh: '',
            val_cnh: '',
            foto: '',
        });
        removeFoto()
    };

    const confirmCreating = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (graduacaoSelected != 'CIVIL' && receivedData.qrcode_efetivo.length != 7) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um número de ordem válido.");
        } else if (graduacaoSelected == 'CIVIL' && receivedData.qrcode_efetivo.length != 10) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um CPF válido.");
        } else if (receivedData.nome_completo.length == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else if (receivedData.nome_guerra.length == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome de guerra válido.");
        } else if (receivedData.id_graduacao == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um posto/gradução válidos.");
        } else if (receivedData.id_unidade == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma unidade válida.");
        } else if (!emailPattern.test(receivedData.email)) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um email válido.");
        } else if (receivedData.id_alerta == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma situação válida.");
        } else {
            if (receivedData.val_cnh != null) {
                const [day, month, year] = receivedData.val_cnh.split('/');
                const formattedValCnh = `${year}/${month}/${day}`;
                receivedData.val_cnh = formattedValCnh;
            }
            sendRequest();
        }
    };


    const sendRequest = async () => {
        const formData = new FormData();
        formData.append('qrcode_efetivo', receivedData.qrcode_efetivo);
        formData.append('nome_guerra', receivedData.nome_guerra);
        formData.append('nome_completo', receivedData.nome_completo);
        formData.append('id_unidade', receivedData.id_unidade);
        formData.append('id_graduacao', receivedData.id_graduacao);
        formData.append('email', receivedData.email);
        formData.append('id_alerta', receivedData.id_alerta);
        if (receivedData.cnh != null) {
            formData.append('cnh', Number(receivedData.cnh));
        } else {
            formData.append('cnh', null);
        }
        if (receivedData.val_cnh.length == 10) {
            formData.append('val_cnh', receivedData.val_cnh);
        } else {
            formData.append('val_cnh', null);
        }
        console.log(formData.val_cnh)
        formData.append('ativo_efetivo', receivedData.ativo_efetivo);
        formData.append('foto', receivedData.foto);

        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            await server.post(`/efetivo`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            renderTable('create');
            closeModal('create');
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao enviar dados.");
            console.log(e.response.data.message)
        }
    };


    const getSelectOptions = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/graduacao`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setGraduacaoOptions(response.data.entities)
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar graduações.");
        }

        try {
            const response = await server.get(`/unidade`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setUnidadeOptions(response.data.entities)
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar unidades.");
        }

        try {
            const response = await server.get(`/alerta`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            setSituacaoOptions(response.data.entities)
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar situações.");
        }
    }

    useEffect(() => {
        getSelectOptions()
    }, [])

    const fileInputRef = useRef(null);

    const detectEntryFoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            setReceivedData({ ...receivedData, foto: file });
            setEfetivoFoto(fileURL);
        }
    }

    const removeFoto = () => {
        setReceivedData({ ...receivedData, foto: '' });
        setEfetivoFoto('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const detectGraduacaoEntry = (element) => {
        setReceivedData({ ...receivedData, id_graduacao: element.target.value })
        const selectedOptionText = element.target.options[element.target.selectedIndex].innerHTML;
        setGraduacaoSelected(selectedOptionText);
    }

    return (
        <>
            <div className="page-container modal">
                <div className="page-title">
                    <h1>Criar efetivo</h1>
                    <h2>Todos os campos obrigatórios devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="efetivo-inputs-1">
                        <div className="input-container">
                            <p>Número de ordem ou documento*</p>
                            <input
                                type="number"
                                className='filtering-input'
                                value={receivedData.qrcode_efetivo}
                                onChange={(e) => setReceivedData({ ...receivedData, qrcode_efetivo: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Nome completo*</p>
                            <input
                                className='filtering-input'
                                value={receivedData.nome_completo}
                                onChange={(e) => setReceivedData({ ...receivedData, nome_completo: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Nome de guerra*</p>
                            <input
                                className='filtering-input'
                                value={receivedData.nome_guerra}
                                onChange={(e) => setReceivedData({ ...receivedData, nome_guerra: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Posto\Graduação*</p>
                            <select
                                value={receivedData.id_graduacao}
                                className='filtering-input'
                                onChange={(e) => detectGraduacaoEntry(e)}>
                                <option value={0}>Nenhuma</option>
                                {graduacaoOptions.map((modulo, i) => (
                                    <option key={i} value={modulo.id}>{modulo.sigla}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-container">
                            <p>Unidade*</p>
                            <select
                                value={receivedData.id_unidade}
                                className='filtering-input'
                                onChange={(e) => setReceivedData({ ...receivedData, id_unidade: e.target.value })}>
                                <option value={0}>Nenhuma</option>
                                {unidadeOptions.map((modulo, i) => (
                                    <option key={i} value={modulo.id}>{modulo.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="efetivo-inputs-2">
                        <div className="input-container">
                            <p>Email*</p>
                            <input
                                className='filtering-input'
                                value={receivedData.email}
                                onChange={(e) => setReceivedData({ ...receivedData, email: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Situação*</p>
                            <select
                                value={receivedData.id_alerta}
                                className='filtering-input'
                                onChange={(e) => setReceivedData({ ...receivedData, id_alerta: e.target.value })}>
                                <option value={0}>Nenhuma</option>
                                {situacaoOptions.map((modulo, i) => (
                                    <option key={i} value={modulo.id}>{modulo.nome_alerta}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-container">
                            <p>Número da CNH</p>
                            <IMaskInput
                                type="text"
                                mask="00000000000"
                                className='filtering-input'
                                value={receivedData.cnh}
                                onChange={(e) => setReceivedData({ ...receivedData, cnh: e.target.value })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Validade da CNH</p>
                            <IMaskInput
                                type="text"
                                mask="00/00/0000"
                                value={receivedData.val_cnh}
                                onChange={(e) => setReceivedData({ ...receivedData, val_cnh: e.target.value })}
                                className="filtering-input"
                            />
                        </div>
                        <div className="input-container">
                            <p>Foto</p>
                            <label htmlFor="arquivo" className="label-foto-input">Enviar arquivo<img src={uploadIcon} /></label>
                            <input
                                type="file"
                                id="arquivo"
                                ref={fileInputRef}
                                className='filtering-input'
                                onChange={detectEntryFoto}
                            />
                            {efetivoFoto && (
                                <div className="foto-preview">
                                    <button className="remove-foto-button" onClick={removeFoto}>
                                        <img src={Remove} />
                                    </button>
                                    <img src={efetivoFoto} alt="Foto do Efetivo" className="militar-foto" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="form-buttons-container">
                        <div className="cancel-button">
                            <button onClick={() => closeModal('create')}>
                                Voltar
                            </button>
                        </div>
                        <div className="form-buttons">
                            <button onClick={() => cleanInputs()}>
                                Limpar campos
                            </button>
                            <button onClick={confirmCreating}>
                                Confirmar
                            </button>
                        </div>
                        <Snackbar
                            ContentProps={{ sx: { borderRadius: '8px' } }}
                            anchorOrigin={{ vertical, horizontal }}
                            open={open}
                            autoHideDuration={2000}
                            onClose={handleClose}
                            key={vertical + horizontal}
                        >
                            <Alert variant="filled" severity="error">
                                {message}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </div>
        </>
    );
}
