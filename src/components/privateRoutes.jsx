import { Navigate } from 'react-router-dom';
import { server } from '../../services/server'

import RelatorioEfetivo from '../pages/relatorio/efetivo.jsx'
import RelatorioVeiculo from '../pages/relatorio/veiculo.jsx'
import PostoServico from '../pages/posto/posto.jsx'
import Unidades from '../pages/unidades/unidade.jsx'
import Usuarios from '../pages/usuarios/usuario.jsx'
import Alertas from '../pages/alertas/alerta.jsx'
import Efetivos from '../pages/efetivos/efetivo.jsx'
import Veiculos from '../pages/veiculos/veiculo.jsx'

// const [userModules, setUserModules] = useState([]);
// const getUserModulos = async () => {
//     let userData = localStorage.getItem('user');
//     let userDataParsed = JSON.parse(userData)
//     let token = localStorage.getItem("user_token")
//     try {
//         const response = await server.get(`/usuario/${userDataParsed.id}`, {
//             headers: {
//                 'Authentication': token,
//                 'access-level': userDataParsed.nivel_acesso
//             }
//         });
//         setUserModules(response.data.entity[0].Modulos)
//         console.log(response.data.entity[0].Modulos)
//     } catch (e) {
//         console.log(e)
//     }
// }

// useEffect(() => {
//     getUserModulos()
// }, []);

const PrivateRoute = ({ component: Component, moduleLink, ...rest }) => {

    let authStatus = JSON.parse(localStorage.getItem("user"));

    let isAuthenticated = authStatus !== null ? true : false

    if (Component == "empty") {
        return <Navigate to="/" />;
    } else {
        return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
    }
};

const PrivateRouteAlunoHome = (props) => <PrivateRoute component={RelatorioEfetivo} moduleLink="/relatorio-efetivos" {...props} />;


export {
    PrivateRouteAlunoHome,
};