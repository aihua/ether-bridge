import React from "react"
import "antd/dist/antd.css"
import "./App.css"
import nervos from './nervos'
import {
    Row,
    Col,
} from 'antd'

import SliderPanel from './containers/SliderPanel'

const {abi} = require('./contracts/compiled')

const transaction = require('./contracts/transaction')
const transferContract = new nervos.appchain.Contract(abi, nervos.contractAddress)

const log = console.log.bind(console, '###')

class App extends React.Component {
    state = {
        metaMaskAddress: window.web3.eth.defaultAccount || '',
        neuronWebAddress: nervos.appchain.defaultAccount || '',
        isVisible: false,
        inputValue: 0,
        ethBalance: 0,
        ebcBalance: 0,
        isAddressSame: false,
    }

    componentDidMount() {
        // log('transferContract', transferContract)
        transferContract.methods.balanceOf(this.state.neuronWebAddress).call().then((res) => {
            this.setState({
                ebcBalance: Number(res) / 1e18,
                inputValue: Number(res) / 1e18,
            })
        }).catch((err) => {
            console.log(err.message)
        })

        window.web3.eth.getBalance(this.state.metaMaskAddress, (err, res) => {
            this.setState({
                ethBalance: res.toNumber() / 1e18,
            })
        })

        this.setState({
            isAddressSame: this.state.metaMaskAddress.toLowerCase() === this.state.neuronWebAddress.toLowerCase(),
        })
    }

    render() {
        let {
            isAddressSame,
            neuronWebAddress,
            metaMaskAddress,
            ebcBalance,
            ethBalance,
        } = this.state

        let sliderInfo = {
            neuronWebAddress,
            metaMaskAddress,
            transaction,
            transferContract,
        }

        return (
            isAddressSame ?
                <React.Fragment>
                    <Row className='dapp-title'>
                        <Col span={24}>Ether Bridge</Col>
                    </Row>
                    <Row>
                        <Col span={24}>neuron-web address: {neuronWebAddress}</Col>
                    </Row>
                    <Row>
                        <Col span={5}>{'eth'}</Col>
                        <Col span={5}>{ethBalance}</Col>
                        <Col span={4}> {'<---------------------->'}</Col>
                        <Col span={5}>{ebcBalance}</Col>
                        <Col span={5}>{'ebc'}</Col>
                    </Row>
                    <SliderPanel {...sliderInfo}/>
                </React.Fragment>

                :

                <React.Fragment>
                    <Row className='dapp-title'>
                        <Col span={24}>Ether Bridge</Col>
                    </Row>
                    <Row>
                        <Col span={24}>MetaMask address is not as same with neuron-web address.</Col>
                    </Row>
                </React.Fragment>

        )
    }
}

export default App
