import { useState } from 'react';
import Header from '../../components/sidebar/sidebar';
import { server } from '../../services/server';
import { IMaskInput } from "react-imask";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserPhoto from '../../assets/login/user-photo.svg'
import QRCode from "react-qr-code";
import OperNormal from '../../assets/crachas/oper-normal.svg'
import OperQrcode from '../../assets/crachas/oper-qrcode.svg'

import { domToPng } from 'modern-screenshot'

import AdNormal from '../../assets/crachas/ad-normal.svg'
import AdQrcode from '../../assets/crachas/ad-qrcode.svg'

// DOM Types

import PrimeiroGdaDom from '../../assets/crachas/1gda.png'
import BAANDom from '../../assets/crachas/baan.png'
import DTCEADom from '../../assets/crachas/dtcea.png'
import GAV from '../../assets/crachas/2_6gav.png'
import GTT from '../../assets/crachas/1gtt.png'
import GDAAE from '../../assets/crachas/3gdaae.png'
import PAAN from '../../assets/crachas/paan.png'
import GACINFRA from '../../assets/crachas/gac.png'

import './style.css'


function Crachas() {
    const [crachaType, setCrachaType] = useState()
    const [domType, setDomType] = useState('')
    const [formData, setFormData] = useState({
        nivel_acesso: 'Operacional',
        categoria: 'Normal',
        validade: '',

        saram: '',
        nome_completo: '',
        militar: '',
        graduacao: '',
        unidade: '',
        foto: '',

        cargo: 'Selecione',
        setor: '',
    })

    const [statusFormData, setStatusFormData] = useState({
        nivel_acesso: false,
        categoria: false,
        validade: false,

        nome_completo: true,
        militar: true,
        graduacao: true,
        unidade: true,

        cargo: true,
        setor: true,
    })

    const cleanInputs = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            nivel_acesso: 'Operacional',
            categoria: 'Normal',
            validade: '',

            saram: '',
            nome_completo: '',
            militar: '',
            graduacao: '',
            unidade: '',
            foto: '',

            cargo: 'Selecione',
            setor: '',
        }))
        setStatusFormData((prevFormData) => ({
            ...prevFormData,
            nivel_acesso: false,
            categoria: false,
            validade: false,

            saram: false,
            nome_completo: true,
            militar: true,
            graduacao: true,
            unidade: true,

            cargo: true,
            setor: true,
        }))
        setCrachaType()
    }

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

    const handleNumeroOrdemChange = (data) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            saram: data,
        }))
        if (data.length === 7) {
            getEfetivo(data);
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                nome_completo: '',
                militar: '',
                graduacao: '',
                unidade: '',
                foto: '',
            }))
            setCrachaType()
        }
    };

    const getEfetivo = async (numero) => {
        try {
            const response = await server.get(`/efetivo/consulta/${numero}`);

            if (response) {
                const { nome_completo, nome_guerra, Unidade, Graduacao, Fotos } = response.data[0];
                let fotoBase64 = '';
                if (Fotos && Fotos.length > 0) {
                    try {
                        const fotoBuffer = Fotos[0].foto.data;
                        fotoBase64 = `data:image/png;base64,${bufferToBase64(fotoBuffer)}`;
                    } catch (error) {
                        console.error('Error converting buffer to Base64:', error);
                    }
                }
                if (fotoBase64.length <= 0) {
                    setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                    setMessage('Este efetivo não possui foto, adicione uma para gerar um crachá');
                    return
                } else {
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        nome_completo: nome_completo || '',
                        graduacao: Graduacao.sigla || '',
                        unidade: Unidade.nome || '',
                        foto: fotoBase64,
                        militar: `${Graduacao.sigla} ${nome_guerra}`
                    }))
                    if (formData.categoria == 'Normal') {
                        setStatusFormData((prevFormData) => ({
                            ...prevFormData,
                            nome_completo: true,
                            militar: true,
                            graduacao: true,
                            unidade: true,
                            cargo: false,
                            setor: false,
                        }))
                    } else {
                        setStatusFormData((prevFormData) => ({
                            ...prevFormData,
                            nome_completo: true,
                            militar: true,
                            graduacao: true,
                            unidade: true,
                            cargo: true,
                            setor: true,
                        }))
                        setCrachaType()
                    }
                }
            }

        } catch (e) {
            setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
            setMessage('Não foi encontrado um efetivo com este número');
            setFormData((prevFormData) => ({
                ...prevFormData,
                nome_completo: '',
                militar: '',
                graduacao: '',
                unidade: '',
                foto: '',
            }))
            setStatusFormData((prevFormData) => ({
                ...prevFormData,
                nome_completo: true,
                militar: true,
                graduacao: true,
                unidade: true,
                cargo: true,
                setor: true,
            }))
            setCrachaType()
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

    const handleSubmit = () => {
        console.log(crachaType)
        console.log(formData)
        if (formData.nivel_acesso == 'Operacional') {
            switch (formData.categoria) {
                case 'Normal':
                    if (formData.saram.length != 7) {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira um Saram válido.");
                    } else if (formData.nome_completo == '' || formData.militar == '' || formData.unidade == '' || formData.foto == '') {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira as informações do efetivo.");
                    } else if (formData.cargo == '') {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira um cargo/função válido.");
                    } else if (formData.setor == '') {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira um setor válido.");
                    } else {
                        setCrachaType(OperNormal);
                        setStatusFormData((prevFormData) => ({
                            ...prevFormData,
                            nivel_acesso: true,
                            categoria: true,
                            validade: true,

                            saram: true,
                            nome_completo: true,
                            militar: true,
                            graduacao: true,
                            unidade: true,

                            cargo: true,
                            setor: true,
                        }))
                    }
                    break;
                case 'Qrcode':
                    if (formData.validade.length != 10 || !validarData(formData.validade)) {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira uma validade válida.");
                    } else if (formData.saram.length != 7) {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira um Saram válido.");
                    } else if (formData.nome_completo == '' || formData.militar == '' || formData.unidade == '' || formData.foto == '') {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira as informações do efetivo.");
                    } else {
                        setCrachaType(OperQrcode);
                        setStatusFormData((prevFormData) => ({
                            ...prevFormData,
                            nivel_acesso: true,
                            categoria: true,
                            validade: true,

                            saram: true,
                            nome_completo: true,
                            militar: true,
                            graduacao: true,
                            unidade: true,

                            cargo: true,
                            setor: true,
                        }))
                    }
                    break;
            }
        } else {
            switch (formData.categoria) {
                case 'Normal':
                    if (formData.saram.length != 7) {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira um Saram válido.");
                    } else if (formData.nome_completo == '' || formData.militar == '' || formData.unidade == '' || formData.foto == '') {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira as informações do efetivo.");
                    } else if (formData.cargo == '') {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira um cargo/função válido.");
                    } else if (formData.setor == '') {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira um setor válido.");
                    } else {
                        setCrachaType(AdNormal);
                        setStatusFormData((prevFormData) => ({
                            ...prevFormData,
                            nivel_acesso: true,
                            categoria: true,
                            validade: true,

                            saram: true,
                            nome_completo: true,
                            militar: true,
                            graduacao: true,
                            unidade: true,

                            cargo: true,
                            setor: true,
                        }))
                    }
                    break;
                case 'Qrcode':
                    if (formData.validade.length != 10 || !validarData(formData.validade)) {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira uma validade válida.");
                    } else if (formData.saram.length != 7) {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira um Saram válido.");
                    } else if (formData.nome_completo == '' || formData.militar == '' || formData.unidade == '' || formData.foto == '') {
                        setState({ ...state, open: true, vertical: 'bottom', horizontal: 'center' });
                        setMessage("Insira as informações do efetivo.");
                    } else {
                        setCrachaType(AdQrcode);
                        setStatusFormData((prevFormData) => ({
                            ...prevFormData,
                            nivel_acesso: true,
                            categoria: true,
                            validade: true,

                            saram: true,
                            nome_completo: true,
                            militar: true,
                            graduacao: true,
                            unidade: true,

                            cargo: true,
                            setor: true,
                        }))
                    }
                    break;
            }
        }
        switch (formData.unidade) {
            case '1° GDA':
                setDomType(PrimeiroGdaDom)
                break;
            case 'BAAN':
                setDomType(BAANDom)
                break;
            case 'DTCEA':
                setDomType(DTCEADom)
                break;
            case '2°/6° GAV':
                setDomType(GAV)
                break;
            case '1° GTT':
                setDomType(GTT)
                break;
            case '3° GDAAE':
                setDomType(GDAAE)
                break;
            case 'PAAN':
                setDomType(PAAN)
                break;
            case 'GAC INFRA':
                setDomType(GACINFRA)
                break;
            default:
                setDomType(BAANDom)
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    unidade: 'BAAN',
                }))
                break;
        }
    }

    const validarData = (data) => {
        return /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.test(data);
    }


    //Handle imprimir

    const print = () => {
        setTimeout(async () => {
            const dataUrl = await domToPng(document.querySelector('#print'), {
                backgroundColor: null,
                width: 400,
                height: 569,
                scale: 2
            });
            const img = document.createElement('img');
            img.src = dataUrl;
            img.style.width = '215px';
            img.style.height = '305px';
            const printWindow = window.open('', '', 'height=569,width=400');
            printWindow.document.open();
            printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Image</title>
                            <style>
                                @media print {
                                    body {
                                        margin: 0;
                                    }
                                    img {
                                        width: 100%;
                                        height: auto;
                                    }
                                }
                            </style>
                        </head>
                        <body>
                            ${img.outerHTML}
                            <script>
                                window.onload = function() {
                                    window.print();
                                    window.onafterprint = function() {
                                        window.close();
                                    };
                                };
                            </script>
                        </body>
                    </html>
                `);
            printWindow.document.close();
        }, 300)
    }

    //Download

    const handleDownloadImage = async () => {
        domToPng(document.querySelector('#print'), {
            backgroundColor: null,
            width: 400 * 2,
            height: 569 * 2,
            scale: 2
        }).then(dataUrl => {
            const link = document.createElement('a');
            link.download = 'cracha.png';
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title no-print" >
                    <h1>Crachás</h1>
                    <h2>Para gerar crachás, informe os dados necessários.</h2>
                </div>
                <div className="page-content-cracha">
                    <div className="cracha-data-container no-print">
                        <div className="cracha-form">
                            <div className="cracha-form-section">
                                <h3>Dados do crachá</h3>
                                <div className="cracha-form-section-line">
                                    <div className="input-container">
                                        <p>Nível de acesso</p>
                                        <select
                                            value={formData.nivel_acesso}
                                            disabled={statusFormData.nivel_acesso}
                                            className='filtering-input'
                                            onChange={(e) => setFormData({ ...formData, nivel_acesso: e.target.value })}
                                        >
                                            <option value={'Operacional'}>Operacional</option>
                                            <option value={'Administrativo'}>Administrativo</option>
                                        </select>
                                    </div>
                                    <div className="input-container">
                                        <p>Categoria</p>
                                        <select
                                            value={formData.categoria}
                                            disabled={statusFormData.categoria}
                                            className='filtering-input'
                                            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                                        >
                                            <option value={'Normal'}>Normal</option>
                                            <option value={'Qrcode'}>Qrcode</option>
                                        </select>
                                    </div>
                                    <div className="input-container">
                                        <p>Validade</p>
                                        <input
                                            type='text'
                                            value={formData.validade}
                                            disabled={statusFormData.validade}
                                            className='filtering-input'
                                            placeholder="DD/MM/AAAA"
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
                                                setFormData({ ...formData, validade: value })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="cracha-form-section">
                                <div className="cracha-form-section-box">
                                    <h3>Efetivo</h3>
                                    <p>Digite o SARAM para pesquisar um efetivo.</p>
                                    <div className="cracha-form-section-line">
                                        <div className="input-container">
                                            <p>Saram</p>
                                            <IMaskInput
                                                type="text"
                                                mask="0000000"
                                                placeholder='Digite aqui para pesquisar'
                                                onChange={(e) => handleNumeroOrdemChange(e.target.value)}
                                                value={formData.saram}
                                                disabled={statusFormData.saram}
                                                className='filtering-input'
                                            />
                                        </div>
                                        <div className="input-container">
                                            <p>Nome completo</p>
                                            <input
                                                type='text'
                                                value={formData.nome_completo}
                                                className='filtering-input'
                                                disabled={statusFormData.nome_completo}
                                                onChange={(e) => setFormData({ ...formData, nome_completo: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="cracha-form-section-line">
                                        <div className="input-container">
                                            <p>Cargo/Função</p>
                                            <select
                                                value={formData.cargo}
                                                disabled={statusFormData.cargo}
                                                className='filtering-input'
                                                onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                                            >
                                                <option value={'Selecione'}>Selecione</option>
                                                <option value={'CHEFE'}>CHEFE</option>
                                                <option value={'AUXILIAR'}>AUXILIAR</option>
                                                <option value={'ADJUNTO'}>ADJUNTO</option>
                                            </select>
                                        </div>
                                        <div className="input-container">
                                            <p>Militar</p>
                                            <input
                                                type='text'
                                                className='filtering-input'
                                                value={formData.militar}
                                                disabled={statusFormData.militar}
                                                onChange={(e) => setFormData({ ...formData, militar: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="cracha-form-section-line">
                                        <div className="input-container">
                                            <p>Setor</p>
                                            <input
                                                type='text'
                                                value={formData.setor}
                                                disabled={statusFormData.setor}
                                                className='filtering-input'
                                                onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                                            />
                                        </div>
                                        <div className="input-container">
                                            <p>Unidade</p>
                                            <input
                                                type='text'
                                                value={formData.unidade}
                                                disabled={statusFormData.unidade}
                                                className='filtering-input'
                                                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="input-foto">
                                    {formData.foto ? (
                                        <img src={formData.foto} alt="Foto do Militar" className='photo-consulta' />
                                    ) : (
                                        <img src={UserPhoto} alt="Sem foto" className='no-photo-consulta' />
                                    )}
                                </div>
                            </div>
                            <div className="form-buttons-container-cracha">
                                <div className="form-buttons">
                                    <button onClick={cleanInputs}>
                                        Limpar campos
                                    </button>
                                    <button onClick={handleSubmit}>
                                        Gerar crachá
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="cracha-result-container">
                        <div className="cracha-result-box" id='print'>
                            {crachaType != null && formData.categoria == 'Normal' && (
                                <>
                                    {domType != '' && (
                                        <img src={domType} className={domType != '' ? 'cracha-normal-dom' : 'cracha-normal-dom-empty'} />
                                    )}
                                    <p className='cracha-normal-dom-title' style={{ color: 'white' }}>{formData.unidade}</p>
                                    <p className='cracha-normal-militar'>{formData.militar}</p>
                                    <p className='cracha-normal-nome-completo'>{formData.nome_completo}</p>
                                    <p className='cracha-normal-cargo'>{formData.cargo}</p>
                                    {formData.foto && (
                                        <img src={formData.foto} className={formData.foto ? 'cracha-normal-foto' : 'cracha-normal-foto-empty'} />
                                    )}
                                    <p className='cracha-normal-setor'>{formData.setor}</p>
                                    <p className='cracha-normal-saram' style={{ color: 'white' }}>
                                        {formData.saram.replace(/(\d{3})(\d{3})(\d)/, '$1.$2-$3')}
                                    </p>
                                </>
                            )}
                            {crachaType != null && formData.categoria == 'Qrcode' && (
                                <>
                                    {domType != '' && (
                                        <img src={domType} className={domType != '' ? 'cracha-qrcode-dom' : 'cracha-normal-dom-empty'} />
                                    )}
                                    <p className='cracha-qrcode-dom-title'>{formData.unidade}</p>
                                    <p className='cracha-qrcode-militar'>{formData.militar}</p>
                                    <p className='cracha-qrcode-unidade'>{formData.unidade}</p>
                                    <p className='cracha-qrcode-validade'>{formData.validade}</p>
                                    {formData.foto && (
                                        <img src={formData.foto} className={formData.foto ? 'cracha-qrcode-foto' : 'cracha-qrcode-foto-empty'} />
                                    )}
                                    <QRCode
                                        size={50}
                                        value={`1,${formData.saram}`}
                                        viewBox={`0 0 50 50`}
                                        className='cracha-qrcode-qrcode'
                                    />
                                    <p className='cracha-qrcode-saram'>
                                        {formData.saram.replace(/(\d{3})(\d{3})(\d)/, '$1.$2-$3')}
                                    </p>
                                </>
                            )}
                            <img src={crachaType} className='cracha-body-img' />
                        </div>

                        <div className="form-buttons-container-cracha no-print">
                            <div className="form-buttons">
                                <button onClick={print}>
                                    Imprimir
                                </button>
                                <button onClick={handleDownloadImage}>
                                    Baixar
                                </button>
                            </div>
                        </div>
                    </div>
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
                <Alert variant="filled" severity="error">
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Crachas;
