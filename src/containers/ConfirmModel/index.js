import React from "react"
import {Col, Modal, Row} from 'antd'
import nervos from '../../nervos'

const log = console.log.bind(console, '###')

class ConfirmModel extends React.Component {

    state = {
        isValuePositive: this.props.inputValue - this.props.ebcBalance < 0 ? false : true
    }

    handleExchange = () => {
        let transferVal = Number(this.props.inputValue - this.props.ebcBalance)
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
            window.web3.eth.sendTransaction({'from': this.props.metaMaskAddress, 'value': transferVal})
        }
    }

    handleOK = () => {
        log('confirm button')
        this.handleExchange()
        this.props.toggleModel()
    }

    render() {
        // console.log(this.props)

        let transferVal = Math.abs(this.props.inputValue - this.props.ebcBalance)
        let unit1 = ''
        let unit2 = ''

        if (this.state.isValuePositive) {
            unit1 = 'eth'
            unit2 = 'ebc'
        } else {
            unit1 = 'ebc'
            unit2 = 'eth'
        }
        //TODO Still working on it
        return (
            <Row>
                <Col span={24}>
                    <Modal
                        title="Basic Modal"
                        visible={this.props.isVisible}
                        onOk={this.handleOK}
                        onCancel={this.props.toggleModel}
                    >
                        <p>您是确认把 {transferVal} {unit1} 转换为 {transferVal} {unit2} 吗？ </p>
                    </Modal>
                </Col>
            </Row>
        )
    }
}



export default ConfirmModel