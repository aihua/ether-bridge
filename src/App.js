import React from "react"
import {
    Row,
    Col,
} from 'antd'
import SliderPanel from './component/SliderPanel'
import TransctionPanel from './component/Transactions';
import nervos from './nervos'
import "./App.css"

const {abi} = require('./contracts/compiled')
const transaction = require('./contracts/transaction')

// get contract instance
const transferContract = new nervos.appchain.Contract(abi, nervos.contractAddress)

const parseValue = (value) => {
    return Math.floor(value / 1e14) / 10000
}

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
        transferContract.methods.balanceOf(this.state.neuronWebAddress).call().then((res) => {
            this.setState({
                ebcBalance: Number(res),
                inputValue: Number(res),
            })
        }).catch((err) => {
            console.log(err.message)
        })

        window.web3.eth.getBalance(this.state.metaMaskAddress, (err, res) => {
            this.setState({
                ethBalance: res.toNumber(),
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
                    <Row className='header-banner'>
                        <Col span={24}></Col>
                    </Row>
                    <Row className='dapp-title'>
                        <Col span={24}>Ether Bridge</Col>
                    </Row>
                    <Row className='account-address'>
                        <Col span={24}>Address: {neuronWebAddress}</Col>
                    </Row>
                    <Row type="flex" justify="center" className='account-token'>
                        <Col className='token-icon' span={3}>
                            <img src="./ether-icon.png" alt=""/>
                        </Col>
                        <Col className='Rectangle-2' span={8}>
                            <span className={'ether'}>ether</span>
                            <span className={'token-value'}>{parseValue(ethBalance)}</span>
                        </Col>
                        <Col className='token-icon' span={2}>
                            <img className='exchange-icon' src="./exchange-icon.png" alt=""/>
                        </Col>
                        <Col className='token-icon' span={3}>
                            <img src="./ebc-icon.png" alt=""/>
                        </Col>
                        <Col className='Rectangle-2' span={8}>
                            <span className={'ether'}>ebc</span>
                            <span className={'token-value'}>{parseValue(ebcBalance)}</span>
                        </Col>
                    </Row>
                    <SliderPanel {...sliderInfo}/>
                    <TransctionPanel neuronWebAddress={neuronWebAddress}/>
                    <Row className='footer-banner'>
                        <Col span={24}></Col>
                    </Row>
                </React.Fragment>

                :

                <React.Fragment>
                    <Row className='header-banner'>
                        <Col span={24}></Col>
                    </Row>
                    <Row className='dapp-title'>
                        <Col span={24}>Ether Bridge</Col>
                    </Row>
                    <Row>
                        <Col span={24}>MetaMask address is not as same with neuron-web address.</Col>
                    </Row>
                    <Row className='footer-banner'>
                        <Col span={24}></Col>
                    </Row>
                </React.Fragment>
        )
    }
}

export default App
