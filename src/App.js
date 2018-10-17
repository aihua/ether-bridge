import React from "react"
// import ReactDOM from 'react-dom';
import "antd/dist/antd.css"
import "./App.css"
import nervos from './nervos'
import {
    Row,
    Col,
    Button,
    Slider,
    InputNumber,
    Icon,
} from 'antd';

const {abi} = require('./contracts/compiled')

const transaction = require('./contracts/transaction')
const transferContract = new nervos.appchain.Contract(abi, nervos.contractAddress)

const log = console.log.bind(console, '###')

const errorNoticePanel = () => {
    return (
        <div>
            <Col span={24}>MetaMask address is not as same with neuron-web address.</Col>
        </div>
    )
}

const exchangePanel = (
    inputValue,
    neuronWebAddress,
    metaMaskAddress,
    ebcBalance,
    ethBalance,
    handleSliderChange,
    handleExchange,
    handleCancelBtn) => {
    return (
        <div>
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
            <Row>
                <Col span={24}>
                    <Slider
                        min={0}
                        max={Number(ethBalance) + Number(ebcBalance)}
                        onChange={handleSliderChange}
                        value={typeof inputValue === 'number' ? inputValue : 0}
                        step={0.01}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Icon type="close-circle" theme="outlined" style={{fontSize: '32px'}} onClick={handleCancelBtn}/>
                </Col>
                <Col span={8}>
                    <InputNumber
                        min={-Number(ebcBalance)}
                        max={Number(ethBalance)}
                        value={Number(inputValue) - Number(ebcBalance)}
                        step={0.01}
                        onChange={handleSliderChange}
                    />
                </Col>
                <Col span={8}>
                    <Button onClick={handleExchange}>exchange</Button>
                </Col>
            </Row>
        </div>
    )
}

//TODO 输入框现在有bug，输入数字不能调整 slider
class App extends React.Component {
    state = {
        metaMaskAddress: window.web3.eth.defaultAccount || '',
        neuronWebAddress: nervos.appchain.defaultAccount || '',
        isAddressSame: false,
        inputValue: 0,
        ethBalance: 0,
        ebcBalance: 0,
    }

    componentDidMount() {
        // log('transferContract', transferContract)
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
                ethBalance: res.toNumber() / 1e18,
            })
        })

        this.setState({
            isAddressSame: this.state.metaMaskAddress.toLowerCase() === this.state.neuronWebAddress.toLowerCase(),
        })
    }

    handleSliderChange = (value) => {
        if (isNaN(value)) {
            return
        }
        this.setState({
            inputValue: value,
        })
    }

    handleExchange = () => {
        log('exchange button')
        //TODO 输入框正数时 eth -> ebc 输入框负数时  ebc -> eth
        let transferVal = Number(this.state.inputValue - this.state.ebcBalance)
        log(typeof transferVal, transferVal)
        // log(transferContract.methods)
        if (transferVal < 0) {
            // ebc -> eth
            log('transferVal < 0 ebc -> eth')
            nervos.appchain.getBlockNumber().then((res) => {
                const num = Number(res)
                transaction.validUntilBlock = num + 88
            }).then(() => {
                return transferContract.methods.withdraw(Math.abs(transferVal) * 1e18).send(transaction)
            }).then((result) => {
                console.log('Waiting for transaction result')
                // alert('Waiting for transaction result')
                return nervos.listeners.listenToTransactionReceipt(result.hash)
            }).then((receipt) => {
                if (receipt.errorMessage === null) {
                    console.log('Transaction Done!')
                    // alert('Transaction Done!')
                } else {
                    throw new Error(receipt.errorMessage)
                }
            }).catch((err) => {
                console.log(err.message)
            })
        } else {
            // eth -> ebc
            window.web3.eth.sendTransaction({'from': this.state.metaMaskAddress}, (err, res) => log(err, res))
        }
    }

    handleCancelBtn = () => {
        log('cancel button')
        transferContract.methods.balanceOf(this.state.neuronWebAddress).call().then((res) => {
            this.setState({
                ebcBalance: Number(res),
                inputValue: Number(res),
            })
        }).catch((err) => {
            console.log(err.message)
        })
    }

    render() {
        let {
            isAddressSame,
            neuronWebAddress,
            metaMaskAddress,
            ebcBalance,
            ethBalance,
            inputValue
        } = this.state
        return (
            <div>
                <Row className='dapp-title'>
                    <Col span={24}>Ether Bridge</Col>
                </Row>
                {isAddressSame ?
                    exchangePanel(
                        inputValue,
                        neuronWebAddress,
                        metaMaskAddress,
                        ebcBalance,
                        ethBalance,
                        this.handleSliderChange,
                        this.handleExchange,
                        this.handleCancelBtn)
                    :
                    errorNoticePanel()}
            </div>
        )
    }
}

export default App

