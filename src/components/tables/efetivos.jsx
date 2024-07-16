import React from 'react';
import Edit from '../../assets/table/edit-icon.svg'
import Delete from '../../assets/table/delete-icon.svg'
import '../../pages/posto/style.css'

const UnidadesTable = ({ data, openModal }) => (
    <div className='table-wrapper'>
        <table className='table table-actions'>
            <thead>
                <tr>
                    <th scope="col">Número de ordem</th>
                    <th scope="col">Nome de guerra</th>
                    <th scope="col">Nome completo</th>
                    <th scope="col">Unidade</th>
                    <th scope="col">Posto / Graduação</th>
                    <th scope="col"><p>Ações</p></th>
                </tr>
            </thead>
            <tbody>
                {data && Array.isArray(data) && data.map((registro, index) => (
                    <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                        <td>{registro.numero_ordem}</td>
                        <td>{registro.nome_guerra}</td>
                        <td>{registro.nome_completo}</td>
                        <td>{registro.unidade}</td>
                        <td>{registro.posto_graduacao}</td>
                        <td>
                            <button onClick={() => openModal("edit", registro)}><img src={Edit} /></button>
                            <button onClick={() => openModal("delete", registro)}><img src={Delete} /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default UnidadesTable;