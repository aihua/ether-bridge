import React from 'react'
import '../tx.css'
import {Icon} from 'antd'
import TxStatusBar from '../txStatusBar'
import TxDetail from '../txDetail'

const log = console.log.bind(console, '###')

class TransactionItem extends React.Component {

    constructor() {
        super()
        this.state = {
            showDetails: false,
            currentEthBlockNum: 0,
        }

        // this.STATUS = {
        //     started: 1,     //'getEthHash and blockNum',
        //     pending: 2,     //'getAppChain hash',
        //     completed: 3,   //'getAppChain receipt without err',
        //     failed: 4       //'failed'
        // };

    }

    toggleDetails = () => {
        // log('toggled')
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    // getStatusNum(status) {
    //     return this.STATUS[status];
    // }

    componentDidMount() {
        setInterval(() => {
            window.web3.eth.getBlockNumber((err, res) => this.setState({
                currentEthBlockNum: res
            }))

            log('curt eth block number:' + this.state.currentEthBlockNum)
        }, 5000)
    }

    parseTimeStamp = (timestamp) => {
        let date = new Date(timestamp)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = date.getDate() + ' '
        let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        return Y + M + D + h + m
    }

    parseValue = (value) => {
        return Math.floor(value / 1e14) / 10000
    }

    render() {
        // log('tx in E2A:', this.props)
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

        // log('txType:', txType)

        const transactionType = {
            eth2ebc: ['eth', 'ebc', '转账发起', '转账确认：',],
            ebc2eth: ['ebc', 'eth', '转账确认', '兑换发起：',],
        }

        const txStatusBarInfo = {
            eth_tx_hash,
            ac_tx_hash,
            status,
            txType,
            transactionType,
        }

        const txDetailInfo = {
            status,
            startedTime,
            eth_block_num,
            eth_tx_hash,
            ac_tx_hash,
            txType,
            transactionType,
            wd_tx_hash,
            currentEthBlockNum: this.state.currentEthBlockNum,
        }

        return (

            <div>
                <div className="transactionMeta" onClick={this.toggleDetails}>
                    <div className="transactionMetaInfo">
                        <label>-{this.parseValue(value) + ' ' + transactionType[txType][0]} ->
                            +{this.parseValue(value) + ' ' + transactionType[txType][1]}  </label>
                        <label><Icon type="clock-circle" theme="outlined"/>{this.parseTimeStamp(startedTime)}
                        </label>
                    </div>
                    <TxStatusBar {...txStatusBarInfo}/>
                </div>
                {this.state.showDetails ? <TxDetail parseTimeStamp={this.parseTimeStamp}{...txDetailInfo}/> : ''}
            </div>
        );
    };
}

export default TransactionItem;
