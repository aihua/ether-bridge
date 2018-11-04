import React from 'react'
import {Icon} from 'antd'
import TxStatusBar from '../txStatusBar'
import TxDetail from '../txDetail'

const parseValue = (value) => {
    return Math.floor(value / 1e14) / 10000
}

const parseTimeStamp = (timestamp) => {
    const date = new Date(timestamp)
    const Y = date.getFullYear()
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    const D = date.getDate()
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours())
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    return `${Y}-${M}-${D} ${h}:${m}`
}

const transactionType = {
    eth2ebc: ['eth', 'ebc', '转账发起', '转账确认：',],
    ebc2eth: ['ebc', 'eth', '转账确认', '兑换发起：',],
}

class TransactionItem extends React.Component {

    constructor() {
        super()
        this.state = {
            showDetails: false,
            currentEthBlockNum: 0,
        }
    }

    toggleDetails = () => {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    componentDidMount() {
        setInterval(() => {
            window.web3.eth.getBlockNumber((err, res) => this.setState({
                currentEthBlockNum: res
            }))
        }, 500)
    }

    render() {
        const {
            eth_tx_hash,
            ac_tx_hash,
            value,
            startedTime,
            status,
            eth_block_num,
            txType,
            wd_tx_hash,
        } = this.props

        const txStatusBarInfo = {
            ethTxHash: eth_tx_hash,
            acTxHash: ac_tx_hash,
            status,
            txType,
            transactionType,
        }

        const txDetailInfo = {
            status,
            startedTime,
            ethBlockNum: eth_block_num,
            ethTxHash: eth_tx_hash,
            acTxHash: ac_tx_hash,
            txType,
            transactionType,
            wdTxHash: wd_tx_hash,
            currentEthBlockNum: this.state.currentEthBlockNum,
        }

        return (
            <div>
                <div className="transactionMeta" onClick={this.toggleDetails}>
                    <div className="transactionMetaInfo">
                        <label>-{parseValue(value) + ' ' + transactionType[txType][0]} ->
                            +{parseValue(value) + ' ' + transactionType[txType][1]}
                        </label>
                        <label>
                            <Icon type="clock-circle" theme="outlined"/>
                            {parseTimeStamp(startedTime)}
                        </label>
                    </div>
                    <TxStatusBar {...txStatusBarInfo}/>
                </div>
                {this.state.showDetails ?
                    <TxDetail parseTimeStamp={parseTimeStamp}{...txDetailInfo}/> : ''
                }
            </div>
        )
    }
}

export default TransactionItem
