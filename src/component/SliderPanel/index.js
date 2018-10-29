import React from "react"
import {
    Row,
    Col,
    Button,
    Slider,
    InputNumber,
} from 'antd'
import './sliderPanel.css'
import ConfirmModel from '../ConfirmModel'

const log = console.log.bind(console, '###')

class SliderPanel extends React.Component {

    state = ({
        inputValue: 0,
        ethBalance: 0,
        ebcBalance: 0,
        isVisible: false,
        isDisable: true,
    })

    componentDidMount() {
        // log('transferContract', transferContract)
        this.props.transferContract.methods.balanceOf(this.props.neuronWebAddress).call().then((res) => {
            this.setState({
                ebcBalance: Number(res) / 1e18,
                inputValue: Number(res) / 1e18,
            })
        }).catch((err) => {
            console.log(err.message)
        })

        window.web3.eth.getBalance(this.props.metaMaskAddress, (err, res) => {
            this.setState({
                ethBalance: res.toNumber() / 1e18,
            })
        })

    }

    handleSliderChange = (value) => {
        if (isNaN(value)) {
            return
        }
        this.setState({
            inputValue: value,
            isDisable: (this.state.inputValue - this.state.ebcBalance).toFixed(4) === 0.0000
        })
    }

    handleCancelBtn = () => {
        log('cancel button')
        this.props.transferContract.methods.balanceOf(this.props.neuronWebAddress).call().then((res) => {
            this.setState({
                ebcBalance: Number(res) / 1e18,
                inputValue: Number(res) / 1e18,
                isDisable: true,
            })
        }).catch((err) => {
            console.log(err.message)
        })
    }

    toggleModel = () => {
        this.setState({
            isVisible: !this.state.isVisible
        })
        log('isVisible', this.state.isVisible)
    }

    parseValue = (value) => {
        return Math.floor(value * 10000) / 10000
    }

    render() {

        let {
            inputValue,
            ethBalance,
            ebcBalance,
            isVisible,
            isDisable,
        } = this.state

        ethBalance = this.parseValue(ethBalance)
        ebcBalance = this.parseValue(ebcBalance)
        inputValue = this.parseValue(inputValue)

        let {
            metaMaskAddress,
            transaction,
            transferContract
        } = this.props

        let transInfo = {
            isVisible,
            inputValue,
            ebcBalance,
            metaMaskAddress,
            transaction,
            transferContract,
        }

        // log('eth', this.parseValue(ethBalance))
        // log('ebc', this.parseValue(ebcBalance))
        // log('ebc + eth', this.parseValue(ethBalance) + this.parseValue(ebcBalance))
        // log('input value', inputValue)

        //TODO Input Form has BUG
        return (
            <div className='slider-panel'>
                <Row type="flex" justify="center" className='token-slider'>
                    <Col span={8}>
                        <Slider
                            min={0}
                            max={ethBalance + ebcBalance}
                            onChange={this.handleSliderChange}
                            value={typeof inputValue === 'number' ? inputValue : 0}
                            step={0.0001}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={3} offset={8}>
                        <Button size='large' icon="undo" onClick={this.handleCancelBtn}>Reset</Button>
                    </Col>
                    <Col span={2}>
                        <InputNumber
                            min={-ebcBalance}
                            max={ethBalance}
                            value={(inputValue - ebcBalance).toFixed(4)}
                            step={0.0001}
                            size={'large'}
                            onChange={(value) => {
                                this.handleSliderChange(value + ebcBalance)
                            }}
                        />
                    </Col>
                    <Col span={3}>
                        {isDisable ?
                            <Button disabled size='large' type={"primary"} onClick={this.toggleModel}>exchange</Button>
                            :
                            <Button size='large' type={"primary"} onClick={this.toggleModel}>exchange</Button>
                        }
                    </Col>
                </Row>
                <ConfirmModel {...transInfo} toggleModel={this.toggleModel.bind(this)}/>
            </div>
        )
    }
}

export default SliderPanel
