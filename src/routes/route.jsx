import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import ConsultarEfetivo from '../pages/login/consultar.jsx';
import RelatorioEfetivo from '../pages/relatorio/efetivo.jsx'
import PostoServico from '../pages/posto/posto.jsx'
import Unidades from '../pages/unidades/unidade.jsx'
import Usuarios from '../pages/usuarios/usuario.jsx'
import Alertas from '../pages/alertas/alerta.jsx'
import Efetivos from '../pages/efetivos/efetivo.jsx'

// import { PrivateRouteEmpty, PrivateRouteAlunoHome, PrivateRouteAlunoEntry, PrivateRouteAlunoExit, PrivateRouteAlunoSignature, PrivateRouteColaboradorHome, PrivateRouteColaboradorHistory, PrivateRouteColaboradorExit, PrivateRouteAdminHome, PrivateRouteAdminStaff, PrivateRouteAdminFamily, PrivateRouteAdminEntry, PrivateRouteAdminExit } from '../components/PrivateRoute.jsx';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/consultarEfetivo" element={<ConsultarEfetivo />} />
        <Route path="/Relatórios-Efetivo" element={<RelatorioEfetivo />} />
        <Route path="/graduacao" element={<PostoServico />} />
        <Route path="/unidade" element={<Unidades />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/efetivos" element={<Efetivos />} />
      </Routes>
    </BrowserRouter>
  )
}
export default Router