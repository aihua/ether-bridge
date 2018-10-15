import React from "react"
// import ReactDOM from "react-dom"
import "antd/dist/antd.css"
import "./index.css"
import nervos from './nervos'

class App extends React.Component {
    state = {
        metaMaskAddress: '',
        neuronWebAddress: '',
    }

    componentDidMount() {
        this.setState({
            metaMaskAddress: window.web3.eth.defaultAccount,
            neuronWebAddress: nervos.appchain.defaultAccount,
        })
    }

    render() {
        const { metaMaskAddress, neuronWebAddress } = this.state
        return (
            <div className="App">
                <p>metamask address: { metaMaskAddress }</p>
                <p>neuron-web address: { neuronWebAddress }</p>
            </div>
        )
    }
}

export default App

