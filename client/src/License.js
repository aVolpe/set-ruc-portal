import React, { Component } from 'react';
import './License.css';

class Credit extends Component {

    constructor(props) {
        super(props);
        this.name = props.name;
        this.projectLink = props.projectLink;
        this.holder = props.holder;
        this.type = props.type;
        this.link = props.link;
        this.shortLink = this.link.length > 10 ? this.link.substring(8, 38) + '...' : this.link;
    }

    render() {
        return (
            <div className="credit">
                <h3><a href="{this.projectLink}" target="_blank">{this.name}</a></h3>
                <ul>
                    <li><b>Copyright</b>: {this.holder}</li>
                    <li><b>Licencia</b>: ({this.type}): <a href="{this.link}" target="_blank">{this.shortLink}</a></li>
                </ul>
            </div>
        )
    }
}

/*Credit.propTypes = {
  name : React.PropTypes.string.isRequired,
  projectLink : React.PropTypes.string.isRequired,
  holder : React.PropTypes.string.isRequired,
  type : React.PropTypes.string.isRequired,
  link : React.PropTypes.string.isRequired
}*/

export default class License extends Component {
    render() {
        return (
            <div>
                <div className="header">
                    <h1>Creditos</h1>
                    <h2>Licencias y acreditaciones</h2>
                </div>
                <p>
                    Esta aplicación utiliza componentes OpenSource.<br />
                    Puedes encontrar el código fuente de los proyectos utilizados junto con sus licencias más abajo.
        </p>

                <Credit
                    name="Yahoo Pure"
                    projectLink="https://github.com/yahoo/pure"
                    holder="Copyright 2013 Yahoo! Inc. All rights reserved."
                    type="3-Clause BSD"
                    link="https://github.com/yahoo/pure/blob/master/LICENSE.md"> </Credit>

                <Credit
                    name="Facebook React"
                    projectLink="https://github.com/facebook/react"
                    holder="Copyright (c) 2013-present, Facebook, Inc. All rights reserved."
                    type="3-Clause BSD"
                    link="https://github.com/facebook/react/blob/master/LICENSE"> </Credit>

                <Credit
                    name="React Router"
                    projectLink="https://github.com/ReactTraining/react-router"
                    holder="Copyright (c) 2015-present, Ryan Florence, Michael Jackson"
                    type="MIT License"
                    link="https://github.com/ReactTraining/react-router/blob/master/LICENSE.md"> </Credit>

                <Credit
                    name="React Tabs"
                    projectLink="https://github.com/reactjs/react-tabs"
                    holder="Copyright (c) 2015 by Matt Zabriskie"
                    type="MIT License"
                    link="https://github.com/reactjs/react-tabs/blob/master/LICENSE"> </Credit>

                <div>
                    <p>La licencia de este proyecto es <a target="_blank" href="https://github.com/aVolpe/set-ruc-finder/blob/master/LICENSE">MIT</a>,
                    los datos proveídos por la SET no tienen licencia y pueden encontrarse
          <a target="_blank" href="http://www.set.gov.py/portal/PARAGUAY-SET/InformesPeriodicos?folder-id=repository:collaboration:/sites/PARAGUAY-SET/categories/SET/Informes%20Periodicos/listado-de-ruc-con-sus-equivalencias"> aquí</a>
                    </p>
                </div>
            </div>
        )
    }
}
