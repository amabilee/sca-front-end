import React from 'react';
import Edit from '../../assets/table/edit-icon.svg'
import Delete from '../../assets/table/delete-icon.svg'
import '../../pages/posto/style.css'

const UnidadesTable = ({ data, openModal }) => (
    <div className='table-wrapper'>
        <table className='table table-actions'>
            <thead>
                <tr>
                    <th scope="col">Nome da unidade</th>
                    <th scope="col">Nível de acesso</th>
                    <th scope="col">Efetivos atualmente</th>
                    <th scope="col">Veículos atualmente</th>
                    <th scope="col"><p>Ações</p></th>
                </tr>
            </thead>
            <tbody>
                {data && Array.isArray(data) && data.map((registro, index) => (
                    <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                        <td>{registro.nome}</td>
                        <td>{registro.nivel_acesso == 1 ? "Portaria" :
                            registro.nivel_acesso == 2 ? "Aviões" :
                                registro.nivel_acesso == 3 ? "Administrativa" :
                                    null
                        }</td>
                        <td>{registro.efetivoCount}</td>
                        <td>{registro.veiculoCount}</td>
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