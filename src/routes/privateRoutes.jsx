import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { server } from '../services/server';
import Loader from '../components/loader/index.jsx';
import { UseAuth } from '../hooks';

import RelatorioEfetivoPage from '../pages/relatorio/efetivo.jsx';
import RelatorioVeiculoPage from '../pages/relatorio/veiculo.jsx';
import PostoServicoPage from '../pages/posto/posto.jsx';
import UnidadesPage from '../pages/unidades/unidade.jsx';
import UsuariosPage from '../pages/usuarios/usuario.jsx';
import AlertasPage from '../pages/alertas/alerta.jsx';
import EfetivosPage from '../pages/efetivos/efetivo.jsx';
import VeiculosPage from '../pages/veiculos/veiculo.jsx';
import CrachasPage from '../pages/crachas/cracha.jsx';
import PessoasPage from '../pages/pessoas/pessoa.jsx';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { signOut } = UseAuth();
  const [userModules, setUserModules] = useState([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState(false);

  const userData = localStorage.getItem('user');
  const userDataParsed = JSON.parse(userData);
  const token = localStorage.getItem('user_token');

  const isAuthenticated = userDataParsed && token ? true : false;

  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const fetchModules = async () => {
      if (isAuthenticated) {
        try {
          const response = await server.get(`/usuario/${userDataParsed.id}`, {
            headers: {
              'Authentication': token,
              'access-level': userDataParsed.nivel_acesso,
            },
          });

          const modules = response?.data?.entity?.Modulos || [];
          setUserModules(modules);

          const moduleLink = currentPath || '';

          const access = modules.some((module) => module.link === moduleLink);

          setHasAccess(access);

          if (!access) {
            console.log(1)
            setRedirect(true);
          }
        } catch (e) {
          console.error('Erro ao buscar módulos:', e);
          console.log(2)
          setRedirect(true);
        } finally {
          console.log(3)
          setLoading(false);
        }
      } else {
        console.log(4)
        setRedirect(true);
        setLoading(false);
      }
    };

    fetchModules();
  }, [isAuthenticated, currentPath]);

  useEffect(() => {
    if (redirect) {
      console.log(5)
      signOut();
    }
  }, [redirect, signOut]);

  if (loading) {
    return <div className="loading-container-route"><Loader /></div>;
  }

  if (redirect) {
    console.log(6)
    return <Navigate to="/" />;
  }

  return <Component {...rest} />;
};

const Usuarios = (props) => <PrivateRoute component={UsuariosPage} {...props} />;
const RelatorioEfetivo = (props) => <PrivateRoute component={RelatorioEfetivoPage} {...props} />;
const RelatorioVeiculo = (props) => <PrivateRoute component={RelatorioVeiculoPage} {...props} />;
const PostoServico = (props) => <PrivateRoute component={PostoServicoPage} {...props} />;
const Unidades = (props) => <PrivateRoute component={UnidadesPage} {...props} />;
const Alertas = (props) => <PrivateRoute component={AlertasPage} {...props} />;
const Efetivos = (props) => <PrivateRoute component={EfetivosPage} {...props} />;
const Veiculos = (props) => <PrivateRoute component={VeiculosPage} {...props} />;
const Crachas = (props) => <PrivateRoute component={CrachasPage} {...props} />;
const Pessoas = (props) => <PrivateRoute component={PessoasPage} {...props} />;

export {
  Usuarios,
  RelatorioEfetivo,
  RelatorioVeiculo,
  PostoServico,
  Unidades,
  Alertas,
  Efetivos,
  Veiculos,
  Crachas,
  Pessoas,
};
