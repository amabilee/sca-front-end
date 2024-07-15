import React from 'react';
import Edit from '../../assets/table/edit-icon.svg';
import Delete from '../../assets/table/delete-icon.svg';
import '../../pages/posto/style.css';

const UsuariosTable = ({ data, openModal }) => (
    <div className='table-wrapper'>
        <table className='table table-actions table-usuarios'>
            <thead>
                <tr>
                    <th scope="col">Nome completo</th>
                    <th scope="col">CPF</th>
                    <th scope="col">Módulos</th>
                    <th scope="col">Nível de acesso</th>
                    <th scope="col"><p>Ações</p></th>
                </tr>
            </thead>
            <tbody>
                {data && Array.isArray(data) && data.map((registro, index) => (
                    <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                        <td>{registro.nome}</td>
                        <td>{registro.cpf}</td>
                        <td>
                            {registro.modulos.split(', ').filter(modulo => modulo !== 'Pessoas' && modulo !== 'Relatórios').map((modulo, i) => (
                                <div key={i}>{modulo}</div>
                            ))}
                        </td>
                        <td>{registro.nivel_acesso === 1 ? "Visualizador" :
                            registro.nivel_acesso === 2 ? "Identificador" : null
                        }</td>
                        <td>
                            <button onClick={() => openModal("edit", registro)}><img src={Edit} alt="Edit" /></button>
                            <button onClick={() => openModal("delete", registro)}><img src={Delete} alt="Delete" /></button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default UsuariosTable;
