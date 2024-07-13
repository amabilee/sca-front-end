import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import RelatorioEfetivo from '../pages/relatorio/efetivo.jsx'
import PostoServico from '../pages/posto/posto.jsx'
import Unidades from '../pages/unidades/unidade.jsx'

// import { PrivateRouteEmpty, PrivateRouteAlunoHome, PrivateRouteAlunoEntry, PrivateRouteAlunoExit, PrivateRouteAlunoSignature, PrivateRouteColaboradorHome, PrivateRouteColaboradorHistory, PrivateRouteColaboradorExit, PrivateRouteAdminHome, PrivateRouteAdminStaff, PrivateRouteAdminFamily, PrivateRouteAdminEntry, PrivateRouteAdminExit } from '../components/PrivateRoute.jsx';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Relatórios-Efetivo" element={<RelatorioEfetivo />} />
        <Route path="/Postos" element={<PostoServico />} />
        <Route path="/Unidades" element={<Unidades />} />
      </Routes>
    </BrowserRouter>
  )
}
export default Router