import React from 'react';
import '../../pages/posto/style.css';

const ConsultarTable = ({ data }) => {
    return (
        <div className='table-wrapper-consulta'>
            <table className='table table-consulta'>
                <thead>
                    <tr>
                        <th scope="col">Tipo</th>
                        <th scope="col">Placa</th>
                        <th scope="col">Cor</th>
                        <th scope="col">Marca</th>
                        <th scope="col">Modelo</th>
                        <th scope="col">Selo 'AN'</th>
                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) && data.length > 0 ? (
                        data.map((registro, index) => (
                            <tr key={index}>
                                <td>{registro.tipo}</td>
                                <td>{registro.placa}</td>
                                <td>{registro.cor_veiculo}</td>
                                <td>{registro.marca}</td>
                                <td>{registro.modelo}</td>
                                <td>{registro.qrcode}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Nenhum registro encontrado</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ConsultarTable;
