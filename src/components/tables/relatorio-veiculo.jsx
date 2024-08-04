import React from 'react';
import './style.css';

const RelatorioVeiculoTable = ({ data }) => {

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  return (
    <div className='table-wrapper'>
      <table className='table table-relatorio table-relatorio-veiculo'>
        <thead>
          <tr>
            <th scope="col">Tipo de movimentação</th>
            <th scope="col">Data</th>
            <th scope="col">Hora</th>
            <th scope="col">Adesivo/Crachá</th>
            <th scope="col">Placa</th>
            <th scope="col">Sentinela/Autorizador</th>
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
              <td>{registro.cracha_veiculo ? registro.cracha_veiculo : registro.Veiculo.qrcode}</td>
              <td>
                {registro.VeiculoSemAn ? registro.VeiculoSemAn.placa : registro.Veiculo ? registro.Veiculo.placa : 'N/A'}
              </td>
              <td>{registro.SentinelaQrcode ? `${registro.SentinelaQrcode.Efetivo.Graduacao.sigla} ${registro.SentinelaQrcode.Efetivo.nome_guerra}`: registro.autorizador}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RelatorioVeiculoTable;
