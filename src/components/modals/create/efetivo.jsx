import React, { useEffect, useState, useRef } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server'
import { IMaskInput } from "react-imask";
import Remove from '../../../assets/remove_icon.svg'

export default function CreateEfetivoModal({ closeModal, renderTable }) {
    const [graduacaoOptions, setGraduacaoOptions] = useState([])
    const [unidadeOptions, setUnidadeOptions] = useState([])
    const [situacaoOptions, setSituacaoOptions] = useState([])
    const [efetivoFoto, setEfetivoFoto] = useState("")
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
    };

    const confirmCreating = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const cnhPattern = /^\d{2}\/\d{2}\/\d{4}$/;
        console.log(receivedData)
        if (receivedData.qrcode_efetivo.length != 7) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um número de ordem válido.");
        } else if (receivedData.nome_completo == 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else if (receivedData.nome_guerra == 0) {
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
        } else if (receivedData.cnh.length != 9) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um número de cnh válido.");
        } else if (!cnhPattern.test(receivedData.val_cnh)) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma data de CNH válida no formato DD/MM/AAAA.");
        } else if (receivedData.foto == '' || receivedData.foto == null) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma foto válida.");
        }
        else {
            // sendRequest();
            console.log(receivedData)
        }
    };

    const sendRequest = async () => {
        try {
            await server.post(`/efetivo`, receivedData);
            renderTable('create');
            closeModal('create');
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao enviar dados.");
        }
    };

    const getSelectOptions = async () => {
        try {
            const response = await server.get(`/graduacao`);
            setGraduacaoOptions(response.data.entities)
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar graduações.");
        }

        try {
            const response = await server.get(`/unidade`);
            setUnidadeOptions(response.data.entities)
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar unidades.");
        }

        try {
            const response = await server.get(`/alerta`);
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

    const detectEntryFoto = (event) => {
        const file = event.target.files[0];
        if (file) {
            imageToByteArray(file).then(byteArray => {
                setReceivedData({ ...receivedData, foto: byteArray });
                setEfetivoFoto(URL.createObjectURL(file));
                console.log(byteArray)
            }).catch(err => {
                console.error('Error converting image to byte array:', err);
            });
        }
    };

    const removeFoto = () => {
        setReceivedData({ ...receivedData, foto: '' });
        setEfetivoFoto(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function imageToByteArray(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onloadend = () => {
                // Convert the image to base64
                const base64String = reader.result.split(',')[1];

                // Decode the base64 string to a byte array
                const binaryString = atob(base64String);
                const byteArray = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    byteArray[i] = binaryString.charCodeAt(i);
                }

                // Create the object in the desired format
                const bufferObject = {
                    type: "Buffer",
                    data: Array.from(byteArray)
                };

                resolve(bufferObject);
            };

            reader.onerror = reject;

            // Read the file as a Data URL
            reader.readAsDataURL(file);
        });
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
                            <p>Número de ordem*</p>
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
                                onChange={(e) => setReceivedData({ ...receivedData, id_graduacao: e.target.value })}>
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
                        <div className="input-container">
                            <p>Email*</p>
                            <input
                                className='filtering-input'
                                value={receivedData.email}
                                onChange={(e) => setReceivedData({ ...receivedData, email: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="efetivo-inputs-2">
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
                            <input
                                type="number"
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
                            <input
                                type="file"
                                ref={fileInputRef}
                                className='filtering-input'
                                onChange={detectEntryFoto}
                            />
                            {efetivoFoto && (
                                <div className="foto-preview">
                                    <button type="button" onClick={() => {
                                        removeFoto();
                                        setReceivedData({ ...receivedData, foto: null });
                                    }}>
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
