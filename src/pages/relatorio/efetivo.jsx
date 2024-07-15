import React, { useState } from 'react'
import Header from '../../components/sidebar/sidebar'
import RelatoriosEfetivosTable from '../../components/tables/relatorio-efetivo'
import '../relatorio/style.css'

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import { ptBR } from 'date-fns/locale/pt-BR';
registerLocale('pt-br', ptBR)

function RelatorioEfetivo() {
    const [registros, setRegistros] = useState([
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        },
        {
            Nomedeguerra: "Soldado A",
            DataInicial: "12/34/5678",
            DataFinal: "12/34/5678",
            HoraInicial: "12:34",
            HoraFinal: "12:34"

        }
    ])

    const [valueNomeGuerra, setValueNomeGuerra] = useState('')
    const [valueDateInicial, setValueDateInicial] = useState('')
    const [valueDateFinal, setValueDateFinal] = useState('')
    const [valueTimeInicial, setValueTimeInicial] = useState('')
    const [valueTimeFinal, setValueTimeFinal] = useState('')

    const sendFilteringConditions = () => {
        let filteringConditions = 
        {
            nomeDeGuerra: valueNomeGuerra,
            dataInicial: valueDateInicial,
            dataFinal: valueDateFinal,
            horarioInicial: valueTimeInicial,
            horarioFinal: valueTimeFinal
        }
        console.log(filteringConditions)
    }

    // Open and Close Modals

    return (
        <div className="body">
            <Header />
            <div className="page-container">
                <div className="page-title">
                    <h1>Registros de entrada e saída - Efetivo</h1>
                    <h2>Para consultar os registros, informe o período desejado</h2>
                </div>
                <div className="page-filters filters-relatorio-efetivo">
                    <div className="input-container">
                        <p>Nome de guerra</p>
                        <input className='filtering-input' value={valueNomeGuerra} onChange={(e) => setValueNomeGuerra(e.target.value)} />
                    </div>
                    <div className="input-container">
                        <p>Data inicial</p>
                        <DatePicker className="filtering-input" selected={valueDateInicial} onChange={(date) => setValueDateInicial(date)} locale="pt-br"/>
                    </div>
                    <div className="input-container">
                        <p>Data final</p>
                        <DatePicker className="filtering-input" selected={valueDateFinal} onChange={(date) => setValueDateFinal(date)} locale="pt-br"/>
                    </div>
                    <div className="input-container">
                        <p>Horário inicial</p>
                        <TimePicker className="filtering-input" onChange={(time) => setValueTimeInicial(time)} value={valueTimeInicial} />
                    </div>
                    <div className="input-container">
                        <p>Horário final</p>
                        <TimePicker className="filtering-input" onChange={(time) => setValueTimeFinal(time)} value={valueTimeFinal} />
                    </div>
                    <button className="searchButton" onClick={sendFilteringConditions}>Pesquisar</button>
                </div>
                <div className="page-content-table">
                    <RelatoriosEfetivosTable data={registros} />
                </div>
            </div>
        </div>
    )
}

export default RelatorioEfetivo