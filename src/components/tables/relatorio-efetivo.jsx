import PropTypes from 'prop-types';
import './style.css'

const RelatorioEfetivoTable = ({ data }) => {

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='table-wrapper'>
      <table className='table table-relatorio'>
        <thead>
          <tr>
            <th scope="col">Tipo de movimentação</th>
            <th scope="col">Data</th>
            <th scope="col">Hora</th>
            <th scope="col">Posto de serviço</th>
            <th scope="col">Pessoa/Militar</th>
            <th scope="col">Sentinela</th>
            <th scope="col">Autorizador</th>
            <th scope="col">Observação</th>
          </tr>
        </thead>
        <tbody>
          {data && Array.isArray(data) && data.map((registro, index) => (
            <tr key={index} scope="row"
              className={
                index % 2 === 0 && !registro.autorizador ? 'row-white row-efetivo' :
                  index % 2 === 0 && registro.autorizador ? 'row-white' :
                    index % 2 !== 0 && !registro.autorizador ? 'row-gray row-efetivo' :
                      'row-gray'
              }>
              <td>{registro.tipo}</td>
              <td>{formatDate(registro.data)}</td>
              <td>{registro.hora}</td>
              <td>{registro.Posto.nome}</td>
              <td>{registro.EfetivoQrcode ? `${registro.EfetivoQrcode.Efetivo.Graduacao.sigla} ${registro.EfetivoQrcode.Efetivo.nome_guerra}` :
                registro.Dependente ? `${registro.Dependente.nome} (${registro.Dependente.cpf})` :
                registro.Visitante ? `${registro.Visitante.nome} (${registro.Visitante.cpf})` : null
              }</td>
              <td>{registro.SentinelaQrcode ? `${registro.SentinelaQrcode.Efetivo.Graduacao.sigla} ${registro.SentinelaQrcode.Efetivo.nome_guerra}`: null}</td>
              <td>{registro.autorizador ? registro.autorizador : 'Dispositivo móvel'}</td>
              <td>{registro.detalhe ? registro.detalhe : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

RelatorioEfetivoTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    tipo: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    hora: PropTypes.string.isRequired,
    Posto: PropTypes.shape({
      nome: PropTypes.string
    }),
    EfetivoQrcode: PropTypes.shape({
      Efetivo: PropTypes.shape({
        Graduacao: PropTypes.shape({
          sigla: PropTypes.string.isRequired
        }).isRequired,
        nome_guerra: PropTypes.string.isRequired
      }).isRequired
    }),
    Dependente: PropTypes.shape({
      nome: PropTypes.string,
      cpf: PropTypes.number
    }),
    Visitante: PropTypes.shape({
      nome: PropTypes.string,
      cpf: PropTypes.string
    }),
    SentinelaQrcode: PropTypes.shape({
      Efetivo: PropTypes.shape({
        Graduacao: PropTypes.shape({
          sigla: PropTypes.string.isRequired
        }).isRequired,
        nome_guerra: PropTypes.string.isRequired
      }).isRequired
    }),
    autorizador: PropTypes.string,
    detalhe: PropTypes.string
  })).isRequired,
};


export default RelatorioEfetivoTable;