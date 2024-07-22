import React from 'react';
import Delete from '../../assets/table/delete-icon.svg';
import Edit from '../../assets/table/edit-icon.svg'
import '../../pages/posto/style.css';
import '../../components/tables/style.css'

const AlertasTable = ({ data, openModal, levelAcesso }) => {
    return (
        <div className='table-wrapper'>
            <table className='table table-actions alerta-table'>
                <thead>
                    <tr>
                        <th scope="col">Descrição do alerta</th>
                        <th scope="col">Cor</th>
                        {levelAcesso && levelAcesso == 2(
                            <th scope="col"><p>Ações</p></th>
                        )}

                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) && data.map((registro, index) => (
                        <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                            <td>{registro.nome_alerta}</td>
                            <td>
                                <div className="color-box" style={{ backgroundColor: registro.cor }}></div>
                            </td>
                            {levelAcesso && levelAcesso == 2 && (
                                <td>
                                    <button onClick={() => openModal("edit", registro)}><img src={Edit} alt="Edit" /></button>
                                    <button onClick={() => openModal("delete", registro)}><img src={Delete} alt="Delete" /></button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlertasTable;
