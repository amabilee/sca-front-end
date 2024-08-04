import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/login/login';
import ConsultarEfetivo from '../pages/login/consultar.jsx';


import {
  RelatorioEfetivo,
  RelatorioVeiculo,
  PostoServico,
  Unidades,
  Usuarios,
  Alertas,
  Efetivos,
  Veiculos,
  Crachas,
  Pessoas,
  Gerencia
} from './privateRoutes.jsx'


function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/consultarEfetivo" element={<ConsultarEfetivo />} />
        <Route path="/relatorio-efetivos" element={<RelatorioEfetivo />} />
        <Route path="/relatorio-veiculos" element={<RelatorioVeiculo />} />
        <Route path="/postos" element={<PostoServico />} />
        <Route path="/unidades" element={<Unidades />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/efetivos" element={<Efetivos />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/crachas" element={<Crachas />} />
        <Route path="/pessoas" element={<Pessoas />} />
        <Route path="/gerencia" element={<Gerencia />} />
      </Routes>
    </BrowserRouter>
  )
}
export default Router