import React from 'react';

const RelatorioEfetivoTable = ({ data }) => (
  <table className='table'>
    <thead>
      <tr>
        <th scope="col">Nome de guerra</th>
        <th scope="col">Data inicial</th>
        <th scope="col">Data final</th>
        <th scope="col">Hora inicial</th>
        <th scope="col" colSpan={1}>Hora final</th>
      </tr>
    </thead>
    <tbody>
      {data && Array.isArray(data) && data.map((registro, index) => (
        <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
          <td>{registro.Nomedeguerra}</td>
          <td>{registro.DataInicial}</td>
          <td>{registro.DataFinal}</td>
          <td>{registro.HoraInicial}</td>
          <td>{registro.HoraFinal}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default RelatorioEfetivoTable;