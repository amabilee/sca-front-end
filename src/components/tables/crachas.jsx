import PropTypes from 'prop-types';
import Returned from '../../assets/table/returned-icon.svg'
import './style.css'

const CrachasTable = ({ data, openModal }) => {

    const isObjectEmpty = (obj) => {
        if (!obj) return true;
        return Object.keys(obj).length === 0;
    };

    const detectRegistroType = (type, currentRegistro) => {
        if (type == 'nome') {
            if (currentRegistro.UltimoRegistroAcessoPessoa.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoPessoa) {
                    if (!isObjectEmpty(registro.EfetivoQrcode) &&
                        !isObjectEmpty(registro.EfetivoQrcode.Efetivo) &&
                        !isObjectEmpty(registro.EfetivoQrcode.Efetivo.Graduacao)) {

                        return `${registro.EfetivoQrcode.Efetivo.Graduacao.sigla} ${registro.EfetivoQrcode.Efetivo.nome_guerra}`;
                    } else if (!isObjectEmpty(registro.Dependente)) {
                        return `${registro.Dependente.nome}`;
                    } else if (!isObjectEmpty(registro.Visitante)) {
                        return registro.Visitante.nome;
                    }
                }
            }

            if (currentRegistro.UltimoRegistroAcessoVeiculo.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoVeiculo) {
                    if (!isObjectEmpty(registro.EfetivoQrcode) &&
                        !isObjectEmpty(registro.EfetivoQrcode.Efetivo) &&
                        !isObjectEmpty(registro.EfetivoQrcode.Efetivo.Graduacao)) {

                        return `${registro.EfetivoQrcode.Efetivo.Graduacao.sigla} ${registro.EfetivoQrcode.Efetivo.nome_guerra}`;
                    } else if (!isObjectEmpty(registro.Dependente)) {
                        return `${registro.Dependente.nome}`;
                    } else if (!isObjectEmpty(registro.Visitante)) {
                        return registro.Visitante.nome;
                    }
                }
            }

            return 'Nome não informado';
        } else if (type == 'placa') {
            if (currentRegistro.UltimoRegistroAcessoPessoa.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoPessoa) {
                    if (!isObjectEmpty(registro.Veiculo)) {
                        return registro.Veiculo.placa;
                    } else if (!isObjectEmpty(registro.VeiculoSemAn)) {
                        return registro.VeiculoSemAn.placa;
                    }
                }
            }

            if (currentRegistro.UltimoRegistroAcessoVeiculo.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoVeiculo) {
                    if (!isObjectEmpty(registro.Veiculo)) {
                        return registro.Veiculo.placa;
                    } else if (!isObjectEmpty(registro.VeiculoSemAn)) {
                        return registro.VeiculoSemAn.placa;
                    }
                }
            }

            return 'Placa não informada';
        } else if (type == 'telefone') {
            if (currentRegistro.UltimoRegistroAcessoPessoa.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoPessoa) {
                    if (!isObjectEmpty(registro.Visitante)) {
                        return registro.Visitante.telefone;
                    }
                }
            }

            if (currentRegistro.UltimoRegistroAcessoVeiculo.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoVeiculo) {
                    if (!isObjectEmpty(registro.Visitante)) {
                        return registro.Visitante.telefone;
                    }
                }
            }

            return 'Telefone não informado';
        } else if (type == 'empresa') {
            if (currentRegistro.UltimoRegistroAcessoPessoa.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoPessoa) {
                    if (!isObjectEmpty(registro.Visitante)) {
                        return registro.Visitante.empresa;
                    } else if (
                        !isObjectEmpty(registro.EfetivoQrcode) &&
                        !isObjectEmpty(registro.EfetivoQrcode.Efetivo) &&
                        !isObjectEmpty(registro.EfetivoQrcode.Efetivo.Unidade)
                    ) {
                        return registro.EfetivoQrcode.Efetivo.Unidade.nome
                    }

                }
            }

            if (currentRegistro.UltimoRegistroAcessoVeiculo.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoVeiculo) {
                    if (!isObjectEmpty(registro.Visitante)) {
                        return registro.Visitante.empresa;
                    } else if (
                        !isObjectEmpty(registro.EfetivoQrcode) &&
                        !isObjectEmpty(registro.EfetivoQrcode.Efetivo) &&
                        !isObjectEmpty(registro.EfetivoQrcode.Efetivo.Unidade)
                    ) {
                        return registro.EfetivoQrcode.Efetivo.Unidade.nome
                    }
                }
            }

            return 'Empresa não informada';
        } else if (type == 'autorizador'){
            if (currentRegistro.UltimoRegistroAcessoPessoa.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoPessoa) {
                    if (String(registro.autorizador).length >= 1) {
                        return registro.autorizador
                    }
                }
            }

            if (currentRegistro.UltimoRegistroAcessoVeiculo.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoVeiculo) {
                    if (String(registro.autorizador).length >= 1) {
                        return registro.autorizador
                    }
                }
            }

            return 'Autorizador não informado';
        } else if (type == 'destino'){
            if (currentRegistro.UltimoRegistroAcessoPessoa.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoPessoa) {
                    if (String(registro.detalhe).length >= 1 && registro.detalhe != null) {
                        return registro.detalhe
                    }
                }
            }

            if (currentRegistro.UltimoRegistroAcessoVeiculo.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoVeiculo) {
                    if (String(registro.detalhe).length >= 1 && registro.detalhe != null) {
                        return registro.detalhe
                    }
                }
            }

            return 'Destino não informado';
        } else if (type == 'tempo'){
            if (currentRegistro.UltimoRegistroAcessoPessoa.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoPessoa) {
                    if (registro.data.length >= 5 && registro.hora.length >= 5) {
                        const [year, month, day] = registro.data.split('-')
                        let formattedDate = `${day}/${month}/${year}`
                        return `${formattedDate} às ${registro.hora}`
                    }
                }
            }

            if (currentRegistro.UltimoRegistroAcessoVeiculo.length > 0) {
                for (const registro of currentRegistro.UltimoRegistroAcessoVeiculo) {
                    if (registro.data.length >= 5 && registro.hora.length >= 5) {
                        const [year, month, day] = registro.data.split('-')
                        let formattedDate = `${day}/${month}/${year}`
                        return `${formattedDate} às ${registro.hora}`
                    }
                }
            }

            return 'Tempo não informado';
        }
    };


    return (
        <div className='table-wrapper-crachas'>
            <table className='table table-actions'>
                <thead>
                    <tr>
                        <th scope="col">Número do crachá</th>
                        <th scope="col">Nome informado</th>
                        <th scope="col">Placa do veículo</th>
                        <th scope="col">Telefone</th>
                        <th scope="col">Empresa</th>
                        <th scope="col">Autorizador</th>
                        <th scope="col">Destino</th>
                        <th scope="col">Data/Horário</th>
                        <th scope="col"><p>Ações</p></th>
                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) && data.map((registro, index) => (
                        <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                            <td>{registro.numero_cracha}</td>
                            <td>{detectRegistroType('nome', registro)}</td>
                            <td>{detectRegistroType('placa', registro)}</td>
                            <td>{detectRegistroType('telefone', registro)}</td>
                            <td>{detectRegistroType('empresa', registro)}</td>
                            <td>{detectRegistroType('autorizador', registro)}</td>
                            <td>{detectRegistroType('destino', registro)}</td>
                            <td>{detectRegistroType('tempo', registro)}</td>
                            <td>
                                <button onClick={() => openModal("delete", registro)}><img src={Returned} alt="Check crachá" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// CrachasTable.propTypes = {
//     data: PropTypes.array.isRequired,
//     openModal: PropTypes.func.isRequired
// };


// "UltimoRegistroAcessoPessoa": [
//         {
//           "autorizador": "1S SILVA",
//           "data": "2024-08-15",
//           "hora": "17:12:45",
//           "detalhe": "teste",
//           "qrcode": 1234564,
//           "id_veiculo": null,
//           "id_veiculo_sem_an": 35,
//           "id_visitante": null,
//           "id_dependente": null,
//           "EfetivoQrcode": {
//             "qrcode": 1234564,
//             "Efetivo": {
//               "nome_guerra": "teste",
//               "Graduacao": {
//                 "sigla": "SO"
//               },
//               "Unidade": {
//                 "nome": "GSE"
//               }
//             }
//           },
//           "VeiculoSemAn": {
//             "placa": "tre1351"
//           },
//           "Veiculo": null,
//           "Dependente": null,
//           "Visitante": null
//         }
//       ]

// "Dependente": {
//             "cpf": 12345612323,
//             "nome": "Teste Dependente"
//           },

// "Visitante": {
//             "cpf": 98948180134,
//             "nome": "Joana Maria da Silva Souza",
//             "empresa": "Clemar Eng"
//           }

export default CrachasTable;
