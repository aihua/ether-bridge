import React from "react"
import {Col, Modal, Row} from 'antd'
import nervos from '../../nervos'
import './confirmModel.css'

const NP = require('number-precision')
const log = console.log.bind(console, '###')

const parseValue = (value) => {
    return Math.floor(value * 10000) / 10000
}

class ConfirmModel extends React.Component {

    handleExchange = () => {
        let ebcBalance = parseValue(this.props.ebcBalance)
        let transferVal = NP.minus(this.props.inputValue, ebcBalance)

        if (transferVal < 0) {
            log('transferVal < 0 ebc -> eth')
            nervos.appchain.getBlockNumber().then((res) => {
                const num = Number(res)
                this.props.transaction.validUntilBlock = num + 88
            }).then(() => {
                transferVal = nervos.utils.toWei(Math.abs(transferVal).toString(), 'ether')
                return this.props.transferContract.methods.withdraw(transferVal).send(this.props.transaction)
            }).then((result) => {
                log('Waiting for transaction result')
                return nervos.listeners.listenToTransactionReceipt(result.hash)
            }).then((receipt) => {
                if (receipt.errorMessage === null) {
                    log('Transaction Done!')
                } else {
                    throw new Error(receipt.errorMessage)
                }
            }).catch((err) => {
                log(err.message)
            })
        } else {
            log('transferVal > 0 eth -> ebc')
            transferVal = window.web3.toWei(Math.abs(transferVal), 'ether')
            window.web3.eth.sendTransaction({
                'from': this.props.metaMaskAddress,
                'to': nervos.adminAddress,
                'value': transferVal
            }, (err, res) => {
                console.log()
            })
        }
    }

    handleOK = () => {
        log('confirm button')
        this.handleExchange()
        this.props.toggleModel()
    }

    render() {
        let ebcBalance = parseValue(this.props.ebcBalance)
        let transferVal = NP.minus(this.props.inputValue, ebcBalance)
        let unit = transferVal > 0 ? ['ether', 'ebc'] : ['ebc', 'ether']

        return (
            <Row>
                <Col span={24}>
                    <Modal
                        visible={this.props.isVisible}
                        onOk={this.handleOK}
                        onCancel={this.props.toggleModel}
                        centered={true}
                    >
                        <div className={'confirm-info'}>
                            <p>确认把 <span>{Math.abs(transferVal.toFixed(4))}</span> {unit[0]}</p>
                            <p>转换为 <span>{Math.abs(transferVal.toFixed(4))}</span> {unit[1]} 吗？</p>
                        </div>
                    </Modal>
                </Col>
            </Row>
        )
    }
}

export default ConfirmModel
