import React, { useState } from 'react'
import Logo from '../../assets/sidebar/air-force-logo.svg'
import LeaveIcon from '../../assets/sidebar/sair-icon.svg'
import ConsultarTable from '../../components/tables/consultar.jsx'
import { server } from "../../services/server.js";
import { useNavigate } from 'react-router-dom'

function ConsultarEfetivo() {
    const navigate = useNavigate()
    const [numeroOrdem, setNumeroOrdem] = useState('')
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
        setNumeroOrdem(data);
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

    const bufferToBase64 = (buffer) => {
        const binary = buffer.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        return window.btoa(binary);
    };

    const getEfetivo = async (numero) => {
        try {
            const response = await server.get(`/efetivo/consulta/${numero}`);
            const { nome_completo, nome_guerra, foto, id_unidade, email, id_graduacao } = response.data[0];

            const fotoBase64 = foto ? `data:image/jpeg;base64,${bufferToBase64(foto.data)}` : '';

            setEfetivoData({
                nome_completo: nome_completo || '',
                nome_guerra: nome_guerra || '',
                foto: fotoBase64,
                id_unidade: id_unidade || '',
                email: email || '',
                id_graduacao: id_graduacao || ''
            });
        } catch (e) {
            console.log(e);
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
        navigate('/')
    }

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
                            <p>Foto</p>
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