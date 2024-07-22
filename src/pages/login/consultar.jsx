import React, { useState, Buffer } from 'react';
import Logo from '../../assets/sidebar/air-force-logo.svg'
import LeaveIcon from '../../assets/sidebar/sair-icon.svg'
import ConsultarTable from '../../components/tables/consultar.jsx'
import { server } from "../../services/server.js";
import { useNavigate } from 'react-router-dom'

function ConsultarEfetivo() {
    const navigate = useNavigate()
    const arrayData = [
        {
            "tipo": "Carro",
            "placa": "ABC-1234",
            "cor_veiculo": "Preto",
            "marca": "Toyota",
            "modelo": "Corolla",
            "qrcode": "123456"
        },
        {
            "tipo": "Moto",
            "placa": "XYZ-5678",
            "cor_veiculo": "Vermelho",
            "marca": "Honda",
            "modelo": "CB 500",
            "qrcode": "789012"
        },
        {
            "tipo": "Moto",
            "placa": "XYZ-5678",
            "cor_veiculo": "Vermelho",
            "marca": "Honda",
            "modelo": "CB 500",
            "qrcode": "789012"
        },
        {
            "tipo": "Moto",
            "placa": "XYZ-5678",
            "cor_veiculo": "Vermelho",
            "marca": "Honda",
            "modelo": "CB 500",
            "qrcode": "789012"
        },
        {
            "tipo": "Moto",
            "placa": "XYZ-5678",
            "cor_veiculo": "Vermelho",
            "marca": "Honda",
            "modelo": "CB 500",
            "qrcode": "789012"
        },
        {
            "tipo": "Moto",
            "placa": "XYZ-5678",
            "cor_veiculo": "Vermelho",
            "marca": "Honda",
            "modelo": "CB 500",
            "qrcode": "789012"
        },
        {
            "tipo": "Moto",
            "placa": "XYZ-5678",
            "cor_veiculo": "Vermelho",
            "marca": "Honda",
            "modelo": "CB 500",
            "qrcode": "789012"
        }
    ];
    const [efetivoData, setEfetivoData] = useState({
        nome_completo: '',
        nome_guerra: '',
        foto: '',
        id_unidade: '',
        email: '',
        id_graduacao: ''
    });

    const handleNumeroOrdemChange = (data) => {
        if (data.length === 7) {
            getEfetivo(data);
        } else {
            setEfetivoData({
                nome_completo: '',
                nome_guerra: '',
                foto: '',
                id_unidade: '',
                email: '',
                id_graduacao: ''
            });
        }
    };

    const bufferToBase64 = (data) => {
        let binaryString = "";
        const bytes = new Uint8Array(data);
        for (let i = 0; i < bytes.length; i++) {
            binaryString += String.fromCharCode(bytes[i]);
        }
        return btoa(binaryString);
    };
    
    const getEfetivo = async (numero) => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData) 
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/efetivo/consulta/${numero}`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });
            const { nome_completo, nome_guerra, foto, Unidade, email, Graduacao, Fotos } = response.data[0];
            let fotoBase64 = '';
            if (Fotos && Fotos.length > 0) {
                try {
                    const fotoBuffer = Fotos[0].foto.data;
                    fotoBase64 = `data:image/png;base64,${bufferToBase64(fotoBuffer)}`;
                } catch (error) {
                    console.error('Error converting buffer to Base64:', error);
                }
            }
    
            setEfetivoData({
                nome_completo: nome_completo || '',
                nome_guerra: nome_guerra || '',
                foto: fotoBase64,
                id_unidade: Unidade.nome || '',
                email: email || '',
                id_graduacao: Graduacao.sigla || ''
            });
    
            console.log(fotoBase64);
        } catch (e) {
            console.error('Error fetching efetivo data:', e);
            setEfetivoData({
                nome_completo: '',
                nome_guerra: '',
                foto: '',
                id_unidade: '',
                email: '',
                id_graduacao: ''
            });
        }
    };
    
    const returnLogin = () => {
        navigate('/');
    };

    return (
        <div className="body">
            <div className="consultar-header">
                <div className="consultar-header-left">
                    <img src={Logo} alt="Logo" />
                    <h1>SISTEMA DE CONTROLE DE ACESSO</h1>
                </div>
                <img src={LeaveIcon} alt="Leave Icon" onClick={returnLogin} />
            </div>
            <div className="consultar-body">
                <h2>Consultar dados</h2>
                <div className="input-pesquisa">
                    <p>Número de ordem</p>
                    <input
                        type="number"
                        placeholder='Digite aqui para pesquisar'
                        onChange={(e) => handleNumeroOrdemChange(e.target.value)}
                    />
                </div>
                <div className="consultar-dados">
                    <h3>Dados do militar</h3>
                    <div className="box-dados-militar">
                        <div className="dados-militar-form">
                            <div className="dados-militar-first-row">
                                <div className="input-container">
                                    <p>Nome completo</p>
                                    <input disabled={true} value={efetivoData.nome_completo} />
                                </div>
                                <div className="input-container">
                                    <p>Nome de guerra</p>
                                    <input disabled={true} value={efetivoData.nome_guerra} />
                                </div>
                            </div>
                            <div className="dados-militar-second-row">
                                <div className="input-container">
                                    <p>Posto/Graduação</p>
                                    <input disabled={true} value={efetivoData.id_graduacao} />
                                </div>
                                <div className="input-container">
                                    <p>Unidade</p>
                                    <input disabled={true} value={efetivoData.id_unidade} />
                                </div>
                                <div className="input-container">
                                    <p>Email</p>
                                    <input disabled={true} value={efetivoData.email} />
                                </div>
                            </div>
                        </div>
                        <div className="input-container input-foto">
                            {efetivoData.foto ? (
                                <img src={efetivoData.foto} alt="Foto do Militar" />
                            ) : (
                                <p>Sem foto</p>
                            )}
                        </div>
                        <div className="input-container input-qrcode">
                            <p>Qr Codes</p>
                            <button className='findQrcode-button'>Visualizar Qr Codes</button>
                        </div>
                    </div>
                    <h3>Veículos cadastrados</h3>
                    <ConsultarTable data={arrayData} />
                </div>
            </div>
        </div>
    );
}

export default ConsultarEfetivo;