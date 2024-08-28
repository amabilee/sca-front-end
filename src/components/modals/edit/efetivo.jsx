import { useState, useEffect, useRef, useCallback } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import "./style.css";
import { server } from '../../../services/server';
import { IMaskInput } from "react-imask";
import Remove from '../../../assets/remove_icon.svg'
import uploadIcon from '../../../assets/upload.svg'

import PropTypes, { string } from 'prop-types';

export default function EditEfetivoModal({ currentData, closeModal, renderTable }) {
    const [graduacaoOptions, setGraduacaoOptions] = useState([]);
    const [unidadeOptions, setUnidadeOptions] = useState([]);
    const [situacaoOptions, setSituacaoOptions] = useState([]);
    const [efetivoFoto, setEfetivoFoto] = useState("");
    const [graduacaoSelected, setGraduacaoSelected] = useState("")
    const [receivedData, setReceivedData] = useState(currentData || {});
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

    const confirmEditing = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (graduacaoSelected == null) {
            if (receivedData.graduacao == 'CIVIL' && String(receivedData.qrcode_efetivo).length <= 9) {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage("Insira um CPF válido.");
            } else if (receivedData.graduacao != 'CIVIL' && String(receivedData.qrcode_efetivo).length != 7) {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage("Insira um número de ordem válido.");
            }
        } else if (graduacaoSelected != null && String(receivedData.qrcode_efetivo).length <= 9) {
            if (graduacaoSelected == 'CIVIL') {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage("Insira um CPF válido.");
            } else if (graduacaoSelected != 'CIVIL' && String(receivedData.qrcode_efetivo).length != 7) {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage("Insira um número de ordem válido.");
            }
        } else if (!receivedData.nome_completo) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else if (!receivedData.nome_guerra) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome de guerra válido.");
        } else if (receivedData.id_graduacao === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um posto/gradução válidos.");
        } else if (receivedData.id_unidade === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma unidade válida.");
        } else if (!emailPattern.test(receivedData.email)) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um email válido.");
        } else if (receivedData.id_alerta === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma situação válida.");
        } else if (String(receivedData.cnh).length != 0 || String(receivedData.val_cnh).length >= 5) {
            if (String(receivedData.cnh).length != 11) {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage("Insira uma CNH válida.");
            } else if (String(receivedData.val_cnh).length != 10) {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage("Insira uma validade da CNH válida.");
            } else {
                if (String(receivedData.val_cnh).length != 0 && receivedData.val_cnh != null) {
                    if (!validarData(receivedData.val_cnh)) {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira uma data válida.");
                    } else {
                        sendRequest();
                    }
                } else {
                    sendRequest();
                }
            }
        } else {
            if (String(receivedData.val_cnh).length != 0 && receivedData.val_cnh != null) {
                if (!validarData(receivedData.val_cnh)) {
                    setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                    setMessage("Insira uma data válida.");
                } else {
                    sendRequest();
                }
            } else {
                sendRequest();
            }
        }
    };

    const validarData = (data) => {
        return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(data);
    }

    const sendRequest = async () => {
        const formData = new FormData();
        formData.append('qrcode_efetivo', receivedData.qrcode_efetivo);
        formData.append('nome_guerra', receivedData.nome_guerra);
        formData.append('nome_completo', receivedData.nome_completo);
        formData.append('id_unidade', receivedData.id_unidade);
        formData.append('id_graduacao', receivedData.id_graduacao);
        formData.append('email', receivedData.email);
        formData.append('id_alerta', receivedData.id_alerta);
        if (String(receivedData.cnh).length >= 5) {
            formData.append('cnh', receivedData.cnh);
        }
        if (String(receivedData.val_cnh).length != 0 && receivedData.val_cnh != null) {

            var [day, month, year] = receivedData.val_cnh.split('/');
            var formattedValCnh = `${year}-${month}-${day}`;
            formData.append('val_cnh', formattedValCnh);
        }
        formData.append('ativo_efetivo', receivedData.ativo_efetivo);
        formData.append('foto', receivedData.foto);

        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            await server.put(`/efetivo/${receivedData.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            renderTable('edit');
            closeModal('edit');
        } catch (e) {
            if (String(receivedData.val_cnh).length != 0 && receivedData.val_cnh != null) {
                const [year, month, day] = receivedData.val_cnh.split('/');
                if (String(year).length == 4) {
                    const formattedValCnh = `${day}/${month}/${year}`;
                    receivedData.val_cnh = formattedValCnh;
                }
            }
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            if (e.response.data.message) {
                setMessage(e.response.data.message);
            } else {
                setMessage("Erro ao enviar dados.");
            }
        }
    };

    const getSelectOptions = useCallback(async () => {
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
            setGraduacaoOptions(response.data.entities);
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
            setUnidadeOptions(response.data.entities);
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
            setSituacaoOptions(response.data.entities);
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao buscar situações.");
        }
    }, [state, setGraduacaoOptions, setUnidadeOptions, setSituacaoOptions, setState, setMessage]);

    // Image Functions

    const bufferToBase64 = (buffer) => {
        const binary = new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '');
        return window.btoa(binary);
    };

    const convertImage = useCallback(() => {
        if (receivedData.foto && receivedData.foto.type !== 'File') {
            const base64String = bufferToBase64(receivedData.foto.data);
            const fileURL = `data:image/png;base64,${base64String}`;
            const buffer = receivedData.foto.data;
            const blob = new Blob([new Uint8Array(buffer)], { type: 'image/png' });
            const file = new File([blob], 'received_image.png', { type: 'image/png', lastModified: Date.now() });

            setReceivedData({ ...receivedData, foto: file });
            setEfetivoFoto(fileURL);
        } else if (receivedData.foto) {
            const fileURL = URL.createObjectURL(receivedData.foto);
            setEfetivoFoto(fileURL);
        }
    }, [receivedData, setReceivedData, setEfetivoFoto]);

    const removeFoto = () => {
        setEfetivoFoto('');
        setReceivedData({ ...receivedData, foto: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const fileInputRef = useRef(null);

    const detectEntryFoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type == 'image/gif' || file.type == 'image/jpeg' || file.type == 'image/png') {
                const fileURL = URL.createObjectURL(file);
                setReceivedData({ ...receivedData, foto: file });
                setEfetivoFoto(fileURL);
            } else {
                setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                setMessage("Imagens somente .jpeg .png .gif");
            }
        }
    };

    useEffect(() => {
        getSelectOptions();
        convertImage();
        if (receivedData && receivedData.val_cnh) {
            const [year, month, day] = receivedData.val_cnh.split('-');
            if (String(year).length == 4) {
                setReceivedData((prevFormData) => ({
                    ...prevFormData,
                    val_cnh: `${day}/${month}/${year}`,
                }));
            } else {
                setReceivedData((prevFormData) => ({
                    ...prevFormData,
                    val_cnh: receivedData.val_cnh,
                }));
            }
        }
    }, [getSelectOptions]);



    const detectGraduacaoEntry = (element) => {
        setReceivedData({ ...receivedData, id_graduacao: element.target.value })
        const selectedOptionText = element.target.options[element.target.selectedIndex].innerHTML;
        setGraduacaoSelected(selectedOptionText);
    }

    return (
        <>
            <div className="page-container modal">
                <div className="page-title">
                    <h1>Editar efetivo</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="efetivo-inputs-1">
                        <div className="input-container">
                            <p>Número de ordem ou documento*</p>
                            <input
                                type="text"
                                maxLength={11}
                                className='filtering-input'
                                disabled={true}
                                value={receivedData.qrcode_efetivo}
                                onChange={(e) => setReceivedData({ ...receivedData, qrcode_efetivo: e.target.value.replace(/[^0-9]/g, "") })}
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
                                onChange={(e) => setReceivedData({ ...receivedData, email: e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '' ) })}
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
                            <input
                                type="text"
                                maxLength={9}
                                className='filtering-input'
                                value={receivedData.cnh != null ? receivedData.cnh : ""}
                                onChange={(e) => setReceivedData({ ...receivedData, cnh: e.target.value.replace(/[^0-9]/g, "") })}
                            />
                        </div>
                        <div className="input-container">
                            <p>Validade da CNH*</p>
                            <input
                                type="text"
                                className='filtering-input'
                                value={receivedData.val_cnh != null ? receivedData.val_cnh : ''}
                                placeholder="DD/MM/YYYY"
                                maxLength={10}
                                onChange={(e) => {
                                    let value = e.target.value;
                                    value = value.replace(/[^0-9]/g, '');
                                    if (value.length > 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2);
                                    }
                                    if (value.length > 5) {
                                        value = value.slice(0, 5) + '/' + value.slice(5, 9);
                                    }
                                    setReceivedData({ ...receivedData, val_cnh: value });
                                }}
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
                            <button onClick={() => closeModal('edit')}>
                                Voltar
                            </button>
                        </div>
                        <div className="form-buttons">
                            <button onClick={confirmEditing}>
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
                            <Alert variant="filled" severity="error" onClose={handleClose}>
                                {message || "Erro desconhecido"}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            </div>
        </>
    );
}

EditEfetivoModal.propTypes = {
    currentData: PropTypes.object,
    closeModal: PropTypes.func,
    renderTable: PropTypes.func,
};