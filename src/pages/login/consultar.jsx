import React, { useState } from 'react';
import Logo from '../../assets/sidebar/air-force-logo.svg'
import LeaveIcon from '../../assets/sidebar/sair-icon.svg'
import ConsultarTable from '../../components/tables/consultar.jsx'
import { server } from "../../services/server.js";
import { useNavigate } from 'react-router-dom'
import UserPhoto from '../../assets/login/user-photo.svg'
import QRCode from "react-qr-code";

function ConsultarEfetivo() {
    const navigate = useNavigate()
    const [viewQr, setViewQr] = useState(false)

    const [veiculosData, setVeiculosData] = useState([])

    const [efetivoData, setEfetivoData] = useState({
        nome_completo: '',
        nome_guerra: '',
        foto: '',
        id_unidade: '',
        email: '',
        id_graduacao: ''
    });

    const handleNumeroOrdemChange = (data) => {
        
        if (data.length === 7 || data.length === 10) {
            getEfetivo(data);
        } else {
            setEfetivoData({
                qrcode_efetivo: '',
                nome_completo: '',
                nome_guerra: '',
                foto: '',
                id_unidade: '',
                email: '',
                id_graduacao: ''
            });
            setVeiculosData([])
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
        try {
            const response = await server.get(`/efetivo/consulta/${numero}`);

            if (response.data[0]) {
                const { nome_completo, nome_guerra, foto, Unidade, email, Graduacao, Fotos, qrcode_efetivo } = response.data[0];
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
                    qrcode_efetivo: String(qrcode_efetivo) || 0,
                    nome_completo: nome_completo || '',
                    nome_guerra: nome_guerra || '',
                    foto: fotoBase64,
                    id_unidade: Unidade.nome || '',
                    email: email || '',
                    id_graduacao: Graduacao.sigla || ''
                });

                try {
                    const response2 = await server.get(`/veiculo?ativo_veiculo=true&efetivo=${response.data[0].id}`);
                    setVeiculosData(response2.data.formattedEntities)
                } catch (e) {
                    console.log(e)
                }
            }

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

    const viewQrCodes = (state) => {
        if (state) {
            setViewQr(true)
        } else {
            setViewQr(false)
        }
    }

    const [isPrinting, setIsPrinting] = useState(false)

    const print = () => {
        setIsPrinting(true)
        setTimeout(() => {
            window.print();
            setIsPrinting(false)
        }, 300)
    }

    return (
        <>
            {!viewQr ? (
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
                            <p>Número de ordem ou documento</p>
                            <input
                                type="text"
                                maxLength={7}
                                placeholder='Digite aqui para pesquisar'
                                onChange={(e) => handleNumeroOrdemChange(e.target.value.replace(/[^0-9]/g, ""))}
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
                                        <img src={efetivoData.foto} alt="Foto do Militar" className='photo-consulta' />
                                    ) : (
                                        <img src={UserPhoto} alt="Sem foto" className='no-photo-consulta' />
                                    )}
                                </div>
                                <div className="input-container input-qrcode">
                                    <p>Qr Codes</p>
                                    <button className='findQrcode-button' onClick={() => viewQrCodes(true)}>Visualizar Qr Codes</button>
                                </div>
                            </div>
                            <h3>Veículos cadastrados</h3>
                            <ConsultarTable data={veiculosData} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="consultar-body">
                    {!isPrinting && (
                        <div className="consulta-button">
                            <button onClick={() => print()}>Imprimir</button>
                            <button onClick={() => setViewQr(false)}>Voltar</button>
                        </div>
                    )}
                    <div className="qrcode-container">
                        {efetivoData && efetivoData.qrcode_efetivo != 0 && (
                            <div className="qrcode-box">
                                <QRCode
                                    size={50}
                                    style={{ height: "100px", maxWidth: "100px", width: "100px" }}
                                    value={`1,${efetivoData.qrcode_efetivo}`}
                                    viewBox={`0 0 50 50`}
                                />
                                <p>{efetivoData.id_graduacao} {efetivoData.nome_guerra} <br />{efetivoData.id_unidade}</p>
                            </div>
                        )}
                        {veiculosData && (
                            veiculosData.map((veiculo, i) => (
                                <div className="qrcode-box" key={i}>
                                    <QRCode
                                        size={50}
                                        style={{ height: "100px", maxWidth: "100px", width: "100px" }}
                                        value={`2,${veiculo.qrcode}`}
                                        viewBox={`0 0 50 50`}
                                    />
                                    <p>{veiculo.tipo} {veiculo.modelo} <br />Placa: {veiculosData[i].placa}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default ConsultarEfetivo;