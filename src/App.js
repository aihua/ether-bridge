import React from "react"
// import ReactDOM from 'react-dom';
import "antd/dist/antd.css"
import "./App.css"
import nervos from './nervos'
import {Row, Col, Button, Slider, InputNumber} from 'antd';

const log = console.log.bind(console, '###')

const AccountPanel = (neuronWebAddress) => {
    return (
        <Row>
            <Col span={24}>neuron-web address: {neuronWebAddress}</Col>
        </Row>
    )
}

const NoticePanel = () => {
    return (
        <div>
            <Col span={24}>MetaMask address is not as same with neuron-web address.</Col>
        </div>
    )
}

const TokenDisplayPanel = () => {
    return(
        <Row>
            <Col span={8}>eth   5.0</Col>
            <Col span={8}> 这里放一个双向箭头</Col>
            <Col span={8}>0.25  ebc</Col>
        </Row>
    )
}

const SliderPannel = (inputValue, handleSliderChange) => {
    return (
        <Row>
            <Col span={24}>
                <Slider
                    min={0}
                    max={1}
                    onChange={handleSliderChange}
                    value={typeof inputValue === 'number' ? inputValue : 0}
                    step={0.01}
                />
            </Col>
        </Row>
    );
}

const InputPanel = (inputValue, handleSliderChange, handleExchange) => {
    return(
        <Row>
            <Col span={8}>这里给一个撤销按钮</Col>
            <Col span={8}>
            <InputNumber
                min={0}
                max={1}
                // style={{ marginLeft: 16 }}
                value={inputValue}
                step={0.01}
                onChange={handleSliderChange}
            />
            </Col>
            <Col span={8}>
                <Button onClick={handleExchange}>exchange</Button>
            </Col>
        </Row>
    )
}

class App extends React.Component {
    state = {
        metaMaskAddress: window.web3.eth.defaultAccount || '',
        neuronWebAddress: nervos.appchain.defaultAccount || '',
        isAddressSame: false,
        inputValue: 0,
    }

    componentDidMount() {

        this.setState({
            isAddressSame: this.state.metaMaskAddress.toLowerCase() === this.state.neuronWebAddress.toLowerCase()
        })

        log('metamask address:', this.state.metaMaskAddress)
        log('neuron-web address:', this.state.neuronWebAddress)
        log(this.state.isAddressSame)
    }

    handleExchange = () => {
        log('exchange button')
        log('metamask address:', this.state.metaMaskAddress.toLowerCase())
        log('neuron-web address:', this.state.neuronWebAddress.toLowerCase())
        log(this.state.isAddressSame)

    }

    handleSliderChange = (value) => {
        if (isNaN(value)) {
            return
        }
        this.setState({
            inputValue: value,
        })
    }


    render() {
        const {neuronWebAddress, inputValue} = this.state

        return (
            <div>
                <Row className='dapp-title'>
                    <Col span={24}>Ether Bridge</Col>
                </Row>
                {AccountPanel(neuronWebAddress)}
                {TokenDisplayPanel()}
                {SliderPannel(inputValue, this.handleSliderChange)}
                {InputPanel(inputValue, this.handleSliderChange, this.handleExchange)}
            </div>
        )
    }
}

export default App

