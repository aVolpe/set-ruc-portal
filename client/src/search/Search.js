import React, { useState } from 'react';
import './Search.css';
import { Config } from '../Config';

export function Search() {

    const [ruc, setRuc] = useState(getRandomOption());
    const [data, setData] = useState([]);
    const [working, setWorking] = useState(true);

    const doFetch = (ruc) => {
        if (!ruc || ruc.length < 3) {
            return;
        }
        setWorking(true);
        fetch(Config.URL + 'find?query=' + ruc)
            .then((response) => response.json())
            .then((response) => {
                setData(response);
                setWorking(false);
            });
    }

    React.useEffect(() => {
        doFetch(ruc);
    }, [ruc])



    const changeCurrentRuc = (evt) => {
        let newRuc = evt.target.value;
        setRuc(newRuc);

    }






    let body = '';
    if (working) {
        body = (<div>Cargando ...</div>)
    } else {
        body = (<table className="pure-table pure-table-horizontal pure-table-striped">
            <thead>
                <tr>
                    <th>Documento</th>
                    <th>Nombre</th>
                    <th>Digito</th>
                </tr>
            </thead>
            <tbody className="results-body">
                {data.length === 0 && <td colspan={3}><p>No hay resultados que coincidan con la búsqueda</p></td>}
                {data.map((i) => {
                    return (
                        <tr key={i.doc}>
                            <td>{i.doc}</td>
                            <td>{i.name}</td>
                            <td>{i.div}</td>
                        </tr>);
                })}
            </tbody>
        </table>
        );
    }

    return (
        <div>
            <div className="header">
                <h1>Buscador</h1>
                <h2>Busca personas por documento</h2>
            </div>
            <form className="pure-form">
                <p>
                    <label>Ingrese un nombre o un RUC para buscar
              <input
                            className="ruc-input"
                            placeholder={"1123456, ASISMED"}
                            type="text"
                            value={ruc}
                            onChange={changeCurrentRuc} />
                    </label>
                </p>
                <div className="result-container">
                    {body}
                </div>
                <p>Puedes buscar por nombre (si es persona fisica primero pon el apellido) o por numero de <b>RUC</b> (sin digito verificador)</p>
                <p>Se limita el resultado a 10 elementos, ingresa más para mejorar los resultados. </p>
            </form>
        </div>
    );
}



function getRandomOption() {

    const initialOptions = [Config.EXAMPLE_RUC, 'ASISMED', 'SANTA CLARA MEDICINA PREPAGA', 'ARTURO VOLPE'];
    return initialOptions[Math.floor(Math.random() * initialOptions.length)];
}