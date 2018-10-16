import React from "react"
import "antd/dist/antd.css"
import "./App.css"
import nervos from './nervos'
import {Row, Col, Button} from 'antd';

const log = console.log.bind(console, '###')

class App extends React.Component {
    state = {
        metaMaskAddress: '',
        neuronWebAddress: '',
        isAddressSame: false,
    }

    componentDidMount() {
        const ethAcconunt = window.web3.eth.defaultAccount
        const nervosAccount = nervos.appchain.defaultAccount

        this.setState({
            metaMaskAddress: ethAcconunt,
            neuronWebAddress: nervosAccount,
            isAddressSame: ethAcconunt.toLowerCase() === nervosAccount.toLowerCase()
        })
        log('metamask address:', this.state.metaMaskAddress)
        log('neuron-web address:', this.state.neuronWebAddress)
        log(this.state.isAddressSame)
    }

    handleExchange = () => {
        log('exchange button')
        // log('metamask address:', this.state.metaMaskAddress.toLowerCase())
        // log('neuron-web address:', this.state.neuronWebAddress.toLowerCase())
        // log(this.state.isAddressSame)

    }

    render() {

        const {metaMaskAddress, neuronWebAddress} = this.state

        const ExchangePanel = () => {
            return (
                <div>
                    <Col span={12}>metamask address: {metaMaskAddress}</Col>
                    <Col span={12}>neuron-web address: {neuronWebAddress}</Col>
                </div>
            )
        }

        const NoticePanel = () => {
            return (
                <div>
                    <Col span={24}>MetaMask address is not as same with neuron-web address.</Col>
                </div>
            )
        }


        return (
            <div>
                <Row className='dapp-title'>
                    <Col span={24}>Ether Bridge</Col>
                </Row>
                <Row>
                    <ExchangePanel/>
                </Row>
                <Row>
                    <Button onClick={this.handleExchange}>exchange</Button>
                </Row>
            </div>
        )
    }
}

export default App

