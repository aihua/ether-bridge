import React from "react"
import {Col, Modal, Row} from 'antd'
import nervos from '../../nervos'
import './confirmModel.css'

const NP = require('number-precision')
const log = console.log.bind(console, '###')

class ConfirmModel extends React.Component {

    handleExchange = () => {
        let ebcBalance = this.parseValue(this.props.ebcBalance)
        let transferVal = NP.minus(this.props.inputValue, ebcBalance)
        if (transferVal < 0) {
            // ebc -> eth
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
            // eth -> ebc
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

    parseValue = (value) => {
        return Math.floor(value * 10000) / 10000
    }

    render() {
        let ebcBalance = this.parseValue(this.props.ebcBalance)
        let transferVal = NP.minus(this.props.inputValue, ebcBalance)

        let unit1 = ''
        let unit2 = ''

        if (transferVal > 0) {
            unit1 = 'ether'
            unit2 = 'ebc'
        } else {
            unit1 = 'ebc'
            unit2 = 'ether'
        }

        return (
            <Row>
                <Col span={24}>
                    <Modal
                        // title="Basic Modal"
                        visible={this.props.isVisible}
                        onOk={this.handleOK}
                        onCancel={this.props.toggleModel}
                        centered={true}
                    >
                        <div className={'confirm-info'}>
                            <p>确认把 <span>{Math.abs(transferVal.toFixed(4))}</span> {unit1}</p>
                            <p>转换为 <span>{Math.abs(transferVal.toFixed(4))}</span> {unit2} 吗？</p>
                        </div>
                    </Modal>
                </Col>
            </Row>
        )
    }
}


export default ConfirmModel
