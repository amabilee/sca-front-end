import React from 'react';
import './style.css'

const RelatorioVeiculoTable = ({ data }) => (
  <div className='table-wrapper'>
    <table className='table table-relatorio'>
      <thead>
        <tr>
          <th scope="col">Tipo de movimentação</th>
          <th scope="col">Data</th>
          <th scope="col">Hora</th>
          <th scope="col">Adesivo/Selo</th>
          <th scope="col">Placa</th>
          <th scope="col">Sentinela</th>
        </tr>
      </thead>
      <tbody>
        {data && Array.isArray(data) && data.map((registro, index) => (
          <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
            <td>{registro.tipo}</td>
            <td>{registro.data}</td>
            <td>{registro.hora}</td>
            <td>{registro.adesivo}</td>
            <td>{registro.placa}</td>
            <td>{registro.sentinela}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RelatorioVeiculoTable;