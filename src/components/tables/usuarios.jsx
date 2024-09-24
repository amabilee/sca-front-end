import { useState } from "react";
import PropTypes from 'prop-types';
import './style.css';

const UsuariosTable = ({ data }) => {

    const [expandedRow, setExpandedRow] = useState(null);

    const toggleRow = (index) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
        <div className='table-wrapper'>
            <table className='table table-usuarios'>
                <thead>
                    <tr>
                        <th scope="col">Militar</th>
                        <th scope="col">Módulos</th>
                        <th scope="col">Nível de acesso</th>
                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) && data.map((registro, index) => (
                        <tr
                            key={index}
                            scope="row"
                            className={`${index % 2 === 0 ? 'row-white' : 'row-gray'} ${expandedRow === index ? 'expanded' : ''}`}
                            onClick={() => toggleRow(index)}
                            title="Clique para expandir"
                        >
                            <td>{registro.graduacao} {registro.nome_guerra}</td>
                            <td>
                                <div className="resumo">
                                    {registro.Modulos.length > 0 && (
                                        <div>{registro.Modulos[0].descricao}...</div>
                                    )}
                                </div>
                                <div className="modulos">
                                    {registro.Modulos.map((modulo, i) => (
                                        <div key={i}>{modulo.descricao}</div>
                                    ))}
                                </div>
                            </td>
                            <td>
                                {registro.nivel_acesso === 1 ? "Visualizador" :
                                    registro.nivel_acesso === 2 ? "Identificador" : null
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

UsuariosTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            graduacao: PropTypes.string.isRequired,
            nome_guerra: PropTypes.string.isRequired,
            Modulos: PropTypes.arrayOf(
                PropTypes.shape({
                    descricao: PropTypes.string.isRequired,
                })
            ).isRequired,
            nivel_acesso: PropTypes.number.isRequired,
        })
    ).isRequired,
};

export default UsuariosTable;
