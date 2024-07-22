import React, { useState, useEffect } from "react";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { server } from '../../../services/server';
import { IMaskInput } from "react-imask";
import EyeOn from '../../../assets/password/eyeOn.svg'
import EyeOff from '../../../assets/password/eyeOff.svg'

export default function CreateUsuarioModal({ closeModal, renderTable }) {
    // Password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const [receivedData, setReceivedData] = useState({
        nome: "",
        cpf: "",
        nivel_acesso: 0,
        ativo_usuario: true,
        usuario: 0,
        senha: "",
        modulos: ""
    });

    const [selectedModules, setSelectedModules] = useState({});

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
        setReceivedData({ ...receivedData, nome: "", nivel_acesso: 0, modulos: "" });
        setSelectedModules({});
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setSelectedModules(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    useEffect(() => {
        let modulosSelected = Object.keys(selectedModules)
            .filter(key => selectedModules[key]);

        if (modulosSelected.includes("Relatórios-Efetivo") || modulosSelected.includes("Relatórios-Veículo")) {
            if (!modulosSelected.includes("Relatórios")) {
                modulosSelected.push("Relatórios");
            }
        } else {
            modulosSelected = modulosSelected.filter(modulo => modulo !== "Relatórios");
        }

        if (modulosSelected.includes("Pessoas-Efetivo") || modulosSelected.includes("Pessoas-Usuário")) {
            if (!modulosSelected.includes("Pessoas")) {
                modulosSelected.push("Pessoas");
            }
        } else {
            modulosSelected = modulosSelected.filter(modulo => modulo !== "Pessoas");
        }

        const modulos = modulosSelected.join(", ");
        setReceivedData(prevData => ({
            ...prevData,
            modulos: modulos
        }));
    }, [selectedModules]);

    const confirmCreating = () => {
        if (receivedData.nome.length === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nome válido.");
        } else if (receivedData.nivel_acesso === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um nível de acesso válido.");
        } else if (receivedData.cpf.length === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um CPF válido.");
        } else if (receivedData.usuario === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira um usuário válido.");
        } else if (receivedData.senha.length === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Insira uma senha válida.");
        } else if (receivedData.modulos.length === 0) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Selecione pelo menos um módulo.");
        } else {
            sendRequest();
        }
    };

    const sendRequest = async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            await server.post(`/usuario`, receivedData, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            renderTable('create');
            closeModal('create');
        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage("Erro ao enviar dados.");
        }
    };

    return (
        <>
            <div className="page-container modal">
                <div className="page-title">
                    <h1>Criar usuário</h1>
                    <h2>Todos os campos devem ser preenchidos</h2>
                </div>
                <div className="edit-form-container">
                    <div className="usuario-inputs-1">
                        <div className="input-container">
                            <p>Nome completo</p>
                            <input className='filtering-input' value={receivedData.nome} onChange={(e) => setReceivedData({ ...receivedData, nome: e.target.value })} />
                        </div>
                        <div className="input-container">
                            <p>Nível de acesso</p>
                            <select value={receivedData.nivel_acesso} onChange={(e) => setReceivedData({ ...receivedData, nivel_acesso: e.target.value })} className='filtering-input filtering-select-level-access'>
                                <option value={0}>Nenhum</option>
                                <option value={1}>Visualizador</option>
                                <option value={2}>Identificador</option>
                            </select>
                        </div>
                        <div className="input-container">
                            <p>CPF</p>
                            <IMaskInput
                                type="text"
                                mask="000.000.000-00"
                                value={receivedData.cpf}
                                onChange={(e) => setReceivedData({ ...receivedData, cpf: e.target.value })}
                                className="filtering-input"
                            />
                        </div>
                        <div className="input-container">
                            <p>Usuário</p>
                            <input type="number" value={receivedData.usuario} onChange={(e) => setReceivedData({ ...receivedData, usuario: e.target.value })} className="filtering-input" />
                        </div>
                        <div className="input-container">
                            <p>Senha</p>
                            <div className='iconPasswordContainer'>
                                <input value={receivedData.senha} onChange={(e) => setReceivedData({ ...receivedData, senha: e.target.value })} className="filtering-input password-input" type={isPasswordVisible ? 'text' : 'password'}  />
                                <img src={isPasswordVisible ? EyeOff : EyeOn} className="eyePassword" onClick={togglePasswordVisibility} />
                            </div>
                        </div>
                    </div>
                    <div className="usuario-inputs-2">
                        <div className="input-container">
                            <p>Módulos</p>
                            <div className="modulos-container">
                                <div className="modulos-container-column">
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Relatórios-Efetivo" onChange={handleCheckboxChange} />
                                        <p>Relatórios-Efetivo</p>
                                    </div>
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Relatórios-Veículo" onChange={handleCheckboxChange} />
                                        <p>Relatórios-Veículo</p>
                                    </div>
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Pessoas-Efetivo" onChange={handleCheckboxChange} />
                                        <p>Pessoas-Efetivo</p>
                                    </div>
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Pessoas-Usuário" onChange={handleCheckboxChange} />
                                        <p>Pessoas-Usuário</p>
                                    </div>
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Postos" onChange={handleCheckboxChange} />
                                        <p>Postos</p>
                                    </div>
                                </div>
                                <div className="modulos-container-column">
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Unidades" onChange={handleCheckboxChange} />
                                        <p>Unidades</p>
                                    </div>
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Veículos" onChange={handleCheckboxChange} />
                                        <p>Veículos</p>
                                    </div>
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Alertas" onChange={handleCheckboxChange} />
                                        <p>Alertas</p>
                                    </div>
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Crachás" onChange={handleCheckboxChange} />
                                        <p>Crachás</p>
                                    </div>
                                    <div className="modulos-checkbox">
                                        <input type="checkbox" name="Gerência" onChange={handleCheckboxChange} />
                                        <p>Gerência</p>
                                    </div>
                                </div>
                            </div>
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
