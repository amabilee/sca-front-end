import PropTypes from 'prop-types';
import Edit from '../../assets/table/edit-icon.svg'
import Delete from '../../assets/table/delete-icon.svg'
import Qrcode from '../../assets/table/qrcode_icon.svg'
import NoQrcode from '../../assets/table/no_qrcode_icon.svg'
import '../../pages/posto/style.css'

const EfetivosTable = ({ data, openModal, levelAcesso, type }) => (
    <div className='table-wrapper'>
        {type != 'cracha' ? (
            <table className='table table-actions'>
                <thead>
                    <tr>
                        <th scope="col">Número de ordem</th>
                        <th scope="col">Posto/Graduação</th>
                        <th scope="col">Nome de guerra</th>
                        <th scope="col">Nome completo</th>
                        <th scope="col">Unidade</th>
                        {levelAcesso && levelAcesso == 2 && (
                            <th scope="col"><p>Ações</p></th>
                        )}

                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) && data.map((registro, index) => (
                        <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                            <td>{registro.qrcode_efetivo}</td>
                            <td>{registro.graduacao}</td>
                            <td>{registro.nome_guerra}</td>
                            <td>{registro.nome_completo}</td>
                            <td>{registro.unidade}</td>
                            {levelAcesso && levelAcesso == 2 && (
                                <td>
                                    <button onClick={() => openModal("edit", registro)}><img src={Edit} /></button>
                                    <button onClick={() => openModal("delete", registro)}><img src={Delete} /></button>
                                </td>
                            )}

                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <table className='table table-actions'>
                <thead>
                    <tr>
                        <th scope="col">Número de ordem</th>
                        <th scope="col">Posto/Graduação</th>
                        <th scope="col">Nome de guerra</th>
                        <th scope="col">Nome completo</th>
                        <th scope="col">Unidade</th>
                        {levelAcesso && levelAcesso == 2 && (
                            <th scope="col"><p>Opcões</p></th>
                        )}

                    </tr>
                </thead>
                <tbody>
                    {data && Array.isArray(data) && data.map((registro, index) => (
                        <tr key={index} scope="row" className={index % 2 === 0 ? 'row-white' : 'row-gray'}>
                            <td>{registro.qrcode_efetivo}</td>
                            <td>{registro.graduacao}</td>
                            <td>{registro.nome_guerra}</td>
                            <td>{registro.nome_completo}</td>
                            <td>{registro.unidade}</td>
                            {levelAcesso && levelAcesso == 2 && (
                                <td>
                                    <button onClick={() => openModal("edit", registro)}><img src={Qrcode} /></button>
                                    <button onClick={() => openModal("delete", registro)}><img src={NoQrcode} /></button>
                                </td>
                            )}

                        </tr>
                    ))}
                </tbody>
            </table>
        )}

    </div>
);

EfetivosTable.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
      qrcode_efetivo: PropTypes.number.isRequired,
      graduacao: PropTypes.string.isRequired,
      nome_guerra: PropTypes.string.isRequired,
      nome_completo: PropTypes.string.isRequired,
      unidade: PropTypes.string.isRequired
    })).isRequired,
    openModal: PropTypes.func.isRequired,
    levelAcesso: PropTypes.number,
    type: PropTypes.string
  };

export default EfetivosTable;