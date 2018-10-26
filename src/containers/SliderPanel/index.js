import React from "react"
import {
    Row,
    Col,
    Button,
    Slider,
    InputNumber,
    Icon,
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
        })
    }

    handleCancelBtn = () => {
        log('cancel button')
        this.props.transferContract.methods.balanceOf(this.props.neuronWebAddress).call().then((res) => {
            this.setState({
                ebcBalance: Number(res) / 1e18,
                inputValue: Number(res) / 1e18,
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

    render() {

        let {
            inputValue,
            ethBalance,
            ebcBalance,
            isVisible,
        } = this.state

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
                            onChange={(value) => {this.handleSliderChange(value + ebcBalance)}}
                        />
                    </Col>
                    <Col span={3}>
                        <Button size='large' type={"primary"} onClick={this.toggleModel}>exchange</Button>
                    </Col>
                </Row>
                <ConfirmModel {...transInfo} toggleModel = {this.toggleModel.bind(this)}/>
            </div>
        )
    }
}

export default SliderPanel
