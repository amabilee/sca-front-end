import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/sidebar/sidebar';

import { server } from '../../services/server';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';

import Loader from '../../components/loader/index';
import { UseAuth } from '../../hooks';
import './style.css'


function Veiculos() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const { signOut } = UseAuth();

    // SnackBar config
    const [message, setMessage] = useState("");
    const [statusAlert, setStatusAlert] = useState("");
    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleClose = () => {
        setState({ ...state, open: false });
    };

    const palette = ['#1B599B', '#58AFCB', '#879DB4', '#3C515D'];

    const [movimentacaoTitle, setMovimentacaoTitle] = useState({ militar: '', pessoas: '', veiculos: '' })
    const [veiculoTitle, setVeiculoTitle] = useState('')
    const [pessoaTitle, setPessoaTitle] = useState('')

    const [gerenciaDadosPessoas, setGerenciaDadosPessoas] = useState([
        { id: 0, value: 0, label: 'Efetivos' },
        { id: 1, value: 0, label: 'Visitantes' },
        { id: 2, value: 0, label: 'Dependetes' },
    ])

    const [gerenciaDadosVeiculos, setGerenciaDadosVeiculos] = useState([
        { id: 0, value: 0, label: 'Motocicletas' },
        { id: 1, value: 0, label: 'Carros' },
        { id: 2, value: 0, label: 'Ônibus' },
        { id: 3, value: 0, label: 'Caminhoneta' },
    ])

    const [gerenciaDadosCards, setGerenciaDadosCards] = useState(
        [
            { titulo: 'Usuários', qnt: 200 },
            { titulo: 'Crachás', qnt: 200 },
            { titulo: 'Unidades', qnt: 200 },
            { titulo: 'Qrcodes', qnt: 200 }
        ])

    const [gerenciaDadosBarChartMilitar, setGerenciaDadosBarChartMilitar] = useState([{ data: [0, 0, 0, 0, 0, 0, 0] }, { data: [0, 0, 0, 0, 0, 0, 0] },])
    const [gerenciaDadosBarChartPessoa, setGerenciaDadosBarChartPessoa] = useState([{ data: [0, 0, 0, 0, 0, 0, 0] }, { data: [0, 0, 0, 0, 0, 0, 0] },])
    const [gerenciaDadosBarChartVeiculo, setGerenciaDadosBarChartVeiculo] = useState([{ data: [0, 0, 0, 0, 0, 0, 0] }, { data: [0, 0, 0, 0, 0, 0, 0] },])

    const getGerencia = useCallback(async () => {
        let userData = localStorage.getItem('user');
        let userDataParsed = JSON.parse(userData);
        let token = localStorage.getItem("user_token")
        try {
            const response = await server.get(`/gerencia`, {
                headers: {
                    'Authentication': token,
                    'access-level': userDataParsed.nivel_acesso
                }
            });

            const {
                efetivo,
                visitante,
                dependente,
                motocicleta,
                carro,
                onibus,
                caminhoneta,
                usuario,
                cracha,
                unidade,
                qrcode,
                entradasPorDiaMilitar,
                saidasPorDiaMilitar,
                entradasPorDiaPessoa,
                saidasPorDiaPessoa,
                entradasPorDiaVeiculo,
                saidasPorDiaVeiculo,
            } = response.data.formattedEntities;

            setGerenciaDadosPessoas([
                { id: 0, value: efetivo || 0, label: 'Efetivos' },
                { id: 1, value: visitante || 0, label: 'Visitantes' },
                { id: 2, value: dependente || 0, label: 'Dependetes' },
            ]);

            const somaTotalPessoas = efetivo + visitante + dependente;
            setPessoaTitle(somaTotalPessoas)

            setGerenciaDadosVeiculos([
                { id: 0, value: motocicleta, label: 'Motocicletas' },
                { id: 1, value: carro, label: 'Carros' },
                { id: 2, value: onibus, label: 'Ônibus' },
                { id: 3, value: caminhoneta, label: 'Caminhoneta' },
            ])

            const somaTotalVeiculos = motocicleta + carro + onibus + caminhoneta;
            setVeiculoTitle(somaTotalVeiculos)

            setGerenciaDadosCards([{ titulo: 'Usuário', qnt: usuario }, { titulo: 'Crachás', qnt: cracha }, { titulo: 'Unidades', qnt: unidade }, { titulo: 'Qrcodes', qnt: qrcode }])
            const somaEntradasMilitar = entradasPorDiaMilitar.reduce((acc, curr) => acc + curr, 0);
            const somaSaidasMilitar = saidasPorDiaMilitar.reduce((acc, curr) => acc + curr, 0);
            const somaTotalMovimentacaoMiltiar = somaEntradasMilitar + somaSaidasMilitar;

            const somaEntradasPessoa = entradasPorDiaPessoa.reduce((acc, curr) => acc + curr, 0);
            const somaSaidasPessoa = saidasPorDiaPessoa.reduce((acc, curr) => acc + curr, 0);
            const somaTotalMovimentacaoPessoa = somaEntradasPessoa + somaSaidasPessoa;

            const somaEntradasVeiculo = entradasPorDiaVeiculo.reduce((acc, curr) => acc + curr, 0);
            const somaSaidasVeiculo = saidasPorDiaVeiculo.reduce((acc, curr) => acc + curr, 0);
            const somaTotalMovimentacaoVeiculo = somaEntradasVeiculo + somaSaidasVeiculo;

            setMovimentacaoTitle((prevMovimentacaoTitle) => ({
                ...prevMovimentacaoTitle,
                militar: somaTotalMovimentacaoMiltiar,
                pessoa: somaTotalMovimentacaoPessoa,
                veiculo: somaTotalMovimentacaoVeiculo,
            }));


            setGerenciaDadosBarChartMilitar(
                [{ data: entradasPorDiaMilitar }, { data: saidasPorDiaMilitar },]
            )

            setGerenciaDadosBarChartPessoa(
                [{ data: entradasPorDiaPessoa }, { data: saidasPorDiaPessoa },]
            )

            setGerenciaDadosBarChartVeiculo(
                [{ data: entradasPorDiaVeiculo }, { data: saidasPorDiaVeiculo },]
            )


            console.log(response.data.formattedEntities)
            setLoading(false)
        } catch (e) {
            if (e.response.status == 401) {
                navigate('/');
                signOut()
            } else {
                setState({ ...state, vertical: 'bottom', horizontal: 'center', open: true });
                setMessage("Erro ao buscar dados:");
                setStatusAlert("error");
            }
        }
    }, [state, navigate, signOut, setGerenciaDadosPessoas, setPessoaTitle, setGerenciaDadosVeiculos, setVeiculoTitle, setGerenciaDadosCards, setMovimentacaoTitle, setGerenciaDadosBarChartMilitar, setGerenciaDadosBarChartPessoa, setGerenciaDadosBarChartVeiculo, setLoading, setState, setMessage, setStatusAlert]);

    useEffect(() => {
        getGerencia('&ativo_veiculo=true', 1);
    }, [getGerencia]);

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title">
                    <h1>Gerência</h1>
                    <h2>Análise e controle abrangente das operações em andamento.</h2>
                </div>
                <div className="page-content-gerencia">
                    {loading ? (
                        <div className="loading-container">
                            <Loader />
                        </div>
                    ) : (
                        <>
                            <div className="gerencia-box-line margin50">
                                <div className="gerencia-box-cards">
                                    <div className="gerencia-box-line">
                                        <div className="gerencia-card">
                                            <p>{gerenciaDadosCards[0].qnt}</p>
                                            <span></span>
                                            <p>{gerenciaDadosCards[0].titulo}</p>
                                        </div>
                                        <div className="gerencia-card">
                                            <p>{gerenciaDadosCards[1].qnt}</p>
                                            <span></span>
                                            <p>{gerenciaDadosCards[1].titulo}</p>
                                        </div>
                                    </div>
                                    <div className="gerencia-box-line">
                                        <div className="gerencia-card">
                                            <p>{gerenciaDadosCards[2].qnt}</p>
                                            <span></span>
                                            <p>{gerenciaDadosCards[2].titulo}</p>
                                        </div>
                                        <div className="gerencia-card">
                                            <p>{gerenciaDadosCards[3].qnt}</p>
                                            <span></span>
                                            <p>{gerenciaDadosCards[3].titulo}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="gerencia-box">
                                    <div className="gerencia-box-line"><p>Pessoas</p><p>{pessoaTitle}</p></div>
                                    <PieChart
                                        colors={palette}
                                        series={[
                                            {
                                                data: gerenciaDadosPessoas,
                                                innerRadius: 40,
                                                outerRadius: 100,
                                                paddingAngle: 2,
                                                cornerRadius: 2,
                                                startAngle: -90,
                                                endAngle: 270,
                                                cx: 95,
                                                cy: 95,
                                            },
                                        ]}
                                        width={400}
                                        height={200}
                                        slotProps={{
                                            legend: {
                                                position: {
                                                    vertical: 'middle',
                                                    horizontal: 'right',
                                                },
                                                itemMarkWidth: 20,
                                                itemMarkHeight: 20,
                                                markGap: 20,
                                                itemGap: 20,
                                                rx: 10,
                                                ry: 10,

                                            }
                                        }}

                                    />

                                </div>
                                <div className="gerencia-box">
                                    <div className="gerencia-box-line"><p>Veículos</p><p>{veiculoTitle}</p></div>
                                    <PieChart
                                        colors={palette}
                                        series={[
                                            {
                                                data: gerenciaDadosVeiculos,
                                                innerRadius: 40,
                                                outerRadius: 100,
                                                paddingAngle: 2,
                                                cornerRadius: 2,
                                                startAngle: -90,
                                                endAngle: 270,
                                                cx: 95,
                                                cy: 95,
                                            },
                                        ]}
                                        width={400}
                                        height={200}
                                        slotProps={{
                                            legend: {
                                                position: {
                                                    vertical: 'middle',
                                                    horizontal: 'right',
                                                },
                                                itemMarkWidth: 20,
                                                itemMarkHeight: 20,
                                                markGap: 20,
                                                itemGap: 20,
                                                rx: 10,
                                                ry: 10,

                                            }
                                        }}

                                    />

                                </div>
                            </div>
                            <div className="gerencia-box-line margin50">
                                <div className="gerencia-box">
                                    <div className="gerencia-box-line">
                                        <div className="gerencia-box-column">
                                            <p>{movimentacaoTitle.militar} movimentações de militar</p>
                                            <div className="gerencia-box-line">
                                                <div className="gerencia-card-circle"></div>
                                                <p>Entrada</p>
                                                <div className="gerencia-card-circle2"></div>
                                                <p>Saída</p>
                                            </div>
                                        </div>
                                    </div>
                                    <BarChart
                                        xAxis={[
                                            {
                                                scaleType: "band",
                                                data: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                                            },
                                        ]}
                                        colors={palette}
                                        series={gerenciaDadosBarChartMilitar}
                                        width={500}
                                        height={300}
                                        slotProps={{ bar: { clipPath: `inset(0px round 10px 10px 0px 0px)` } }}
                                    />
                                </div>
                                <div className="gerencia-box">
                                    <div className="gerencia-box-line">
                                        <div className="gerencia-box-column">
                                            <p>{movimentacaoTitle.pessoa} movimentações de pessoas</p>
                                            <div className="gerencia-box-line">
                                                <div className="gerencia-card-circle"></div>
                                                <p>Entrada</p>
                                                <div className="gerencia-card-circle2"></div>
                                                <p>Saída</p>
                                            </div>
                                        </div>
                                    </div>
                                    <BarChart
                                        xAxis={[
                                            {
                                                scaleType: "band",
                                                data: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                                            },
                                        ]}
                                        colors={palette}
                                        series={gerenciaDadosBarChartPessoa}
                                        width={500}
                                        height={300}
                                        slotProps={{ bar: { clipPath: `inset(0px round 10px 10px 0px 0px)` } }}
                                    />
                                </div>
                                <div className="gerencia-box">
                                    <div className="gerencia-box-line">
                                        <div className="gerencia-box-column">
                                            <p>{movimentacaoTitle.veiculo} movimentações de veículos</p>
                                            <div className="gerencia-box-line">
                                                <div className="gerencia-card-circle"></div>
                                                <p>Entrada</p>
                                                <div className="gerencia-card-circle2"></div>
                                                <p>Saída</p>
                                            </div>
                                        </div>
                                    </div>
                                    <BarChart
                                        xAxis={[
                                            {
                                                scaleType: "band",
                                                data: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
                                            },
                                        ]}
                                        colors={palette}
                                        series={gerenciaDadosBarChartVeiculo}
                                        width={500}
                                        height={300}
                                        slotProps={{ bar: { clipPath: `inset(0px round 10px 10px 0px 0px)` } }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div >
            <Snackbar
                ContentProps={{ sx: { borderRadius: '8px' } }}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                key={vertical + horizontal}
            >
                <Alert variant="filled" severity={statusAlert}>
                    {message}
                </Alert>
            </Snackbar>
        </div >
    );
}

export default Veiculos;
