import React from 'react';
import Edit from '../../assets/table/edit-icon.svg'
import Delete from '../../assets/table/delete-icon.svg'
import Activate from '../../assets/table/active-icon.svg'
import './style.css'

const UnidadesTable = ({ data, openModal, levelAcesso, archived }) => (
    <div className='table-wrapper'>
        <table className='table table-actions table-veiculos'>
            <thead>
                <tr>
                    <th scope="col">Responsável</th>
                    <th scope="col">Tipo</th>
                    <th scope="col">Cor</th>
                    <th scope="col">Placa</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Modelo</th>
                    <th scope="col">RENAVAM</th>
                    <th scope="col">Selo/AN</th>
                    {levelAcesso == 2 && (
                        <th scope="col"><p>Ações</p></th>
                    )}

                </tr>
            </thead>
            <tbody>
                {data && Array.isArray(data) && data.map((registro, index) => (
                    <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                        <td>{registro.graduacao} {registro.nome_guerra}</td>
                        <td>{registro.tipo}</td>
                        <td>{registro.cor_veiculo}</td>
                        <td>{registro.placa}</td>
                        <td>{registro.marca}</td>
                        <td>{registro.modelo}</td>
                        <td>{registro.renavam}</td>
                        <td>{registro.qrcode}</td>
                        {levelAcesso == 2 && !archived && (
                            <td>
                                <button onClick={() => openModal("edit", registro)}><img src={Edit} /></button>
                                <button onClick={() => openModal("delete", registro)}><img src={Delete} /></button>
                            </td>
                        )}
                        {levelAcesso == 2 && archived && (
                            <td>
                                <button onClick={() => openModal("activate", registro)}><img src={Activate} /></button>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default UnidadesTable;