import React, { Component } from 'react';
import './Download.css';
import { Config } from '../Config.js';

class Download extends Component {

    render() {
        return (
            <div className="download">
                <div className="header">
                    <h1>Descargar</h1>
                    <h2>Obten los datos en formatos accesibles y procesables por una maquina</h2>
                </div>
                <p>
                    <a className="first-button" href={Config.JSON_FILE} target="_blank"> JSON </a>
                    <a className="" href={Config.CSV_FILE} target="_blank"> CSV (separado por |) </a>
                </p>
            </div>
        );
    }
}

export default Download;
