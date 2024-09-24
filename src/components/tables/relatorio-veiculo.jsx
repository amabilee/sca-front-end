import PropTypes from 'prop-types';
import './style.css';

const RelatorioVeiculoTable = ({ data }) => {

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='table-wrapper'>
      <table className='table table-relatorio-veiculo'>
        <thead>
          <tr>
            <th scope="col">Tipo de movimentação</th>
            <th scope="col">Data</th>
            <th scope="col">Hora</th>
            <th scope="col">Posto de serviço</th>
            <th scope="col">Adesivo/Crachá</th>
            <th scope="col">Placa</th>
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
              <td>{registro.cracha_veiculo ? registro.cracha_veiculo : registro.Veiculo ? registro.Veiculo.qrcode : registro.VeiculoSemAn ? registro.VeiculoSemAn.qrcode : 'N/A'}</td>
              <td>
                {registro.VeiculoSemAn ? registro.VeiculoSemAn.placa : registro.Veiculo ? registro.Veiculo.placa : 'N/A'}
              </td>
              <td>{registro.SentinelaQrcode ? `${registro.SentinelaQrcode.Efetivo.Graduacao.sigla} ${registro.SentinelaQrcode.Efetivo.nome_guerra}`: null}</td>
              <td>{registro.autorizador ? registro.autorizador: 'Dispositivo móvel'}</td>
              <td>{registro.detalhe ? registro.detalhe : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

RelatorioVeiculoTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    tipo: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    hora: PropTypes.string.isRequired,
    cracha_veiculo: PropTypes.number,
    Veiculo: PropTypes.shape({
      qrcode: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }),
    VeiculoSemAn: PropTypes.shape({
      placa: PropTypes.string,
    }),
    SentinelaQrcode: PropTypes.shape({
      Efetivo: PropTypes.shape({
        Graduacao: PropTypes.shape({
          sigla: PropTypes.string.isRequired,
        }),
        nome_guerra: PropTypes.string.isRequired,
      })
    }),
    autorizador: PropTypes.string
  })).isRequired,
};

export default RelatorioVeiculoTable;
