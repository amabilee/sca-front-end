import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Delete from '../../assets/table/delete-icon.svg';
import '../../pages/posto/style.css';

const AlertasTable = ({ data, openModal }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR });
    };

    return (
        <div className='table-wrapper'>
            <table className='table table-actions'>
                <thead>
                    <tr>
                        <th scope="col">Categoria</th>
                        <th scope="col">Mensagem</th>
                        <th scope="col">Data/Horário</th>
                        <th scope="col"><p>Ações</p></th>
                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) && data.map((registro, index) => (
                        <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                            <td>{registro.categoria}</td>
                            <td>{registro.mensagem}</td>
                            <td>{formatDate(registro.data)}</td>
                            <td>
                                <button onClick={() => openModal("delete", registro)}>
                                    <img src={Delete} alt="Delete icon" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AlertasTable;
