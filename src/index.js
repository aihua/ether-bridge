import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {nervos} from './nervos'

window.addEventListener('neuronWebReady', () => {
    // inject new nervos method from neuron-web extension
    window.addMessenger(nervos)

    // set timeout to make sure load neurno-web first before render page.
    setTimeout(() => {
        ReactDOM.render(<App />, document.getElementById('root'))
    }, 100)
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
