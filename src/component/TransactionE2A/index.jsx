import React from 'react'
import '../../styles/tx.css'
import {Icon} from 'antd'
import TxStatusBar from '../txStatusBar'

const log = console.log.bind(console, '###')

class TransactionE2A extends React.Component {

    constructor() {
        super();
        this.state = {
            showDetails: false,
            currentEthBlockNum: 0,
        }

        this.STATUS = {
            started: 1,     //'getEthHash and blockNum',
            pending: 2,     //'getAppChain hash',
            completed: 3,   //'getAppChain receipt without err',
            failed: 4       //'failed'
        };

    }

    toggleDetails = () => {
        log('toggled')
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    getStatusNum(status) {
        return this.STATUS[status];
    }

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
        } = this.props

        const txStatusBarInfo = {
            eth_tx_hash,
            ac_tx_hash,
            status,
        }

        const etherScanLink = <a target="_blank" rel="noopener noreferrer"
                                 href={'https://kovan.etherscan.io/tx/' + eth_tx_hash}>{eth_tx_hash}</a>

        const microscopeLink = <a target="_blank" rel="noopener noreferrer"
                                  href={'http://microscope.cryptape.com/#/transaction/' + ac_tx_hash}>{ac_tx_hash}</a>
        const showTxDetail = (showDetails) => {
            if (showDetails) {
                return(
                    <div className="transactionDetail">
                        <div className="transactionDetailItems">
                            <div className="transactionDetailSingleItem">
                                <label>转账发起：</label>
                                <label style={{float: 'right'}}>{this.parseTimeStamp(startedTime)}</label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>ether 交易哈希：</label>
                                {/*<label style={{float: 'right'}}>{this.props.eth_tx_hash}</label>*/}
                                <label style={{float: 'right'}}>{etherScanLink}</label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>转账确认：</label>
                                {/* 初始状态（即已经获取到了eth hash和blockNum），是要显示 confirmation 数量*/}
                                <label style={{float: 'right'}}>
                                    {Number(this.state.currentEthBlockNum - eth_block_num) > 30
                                        ? '已确认' : Number(this.state.currentEthBlockNum - eth_block_num)} /30
                                </label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>兑换确认：</label>
                                {/* 初始状态（即已经获取到了eth hash和blockNum），还未发起，此时状态为NA */}
                                {this.getStatusNum(status) === 1 && <label style={{float: 'right'}}>NA</label>}
                                {/* 非初始状态，此时状态为 Completed，因为 appChain 上的交易，只要发起就可以确认，不存在pending状态 */}
                                {(this.getStatusNum(status) > 1 && this.getStatusNum(status) < 4) &&
                                <label style={{float: 'right'}}>Completed</label>}
                                {/* 5 状态表示失败，可能原因很多，显示失败状态在这里 */}
                                {this.getStatusNum(status) === 4 &&
                                <label style={{float: 'right'}}>Failed</label>}
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>ebc 交易哈希：</label>
                                {/* 初始状态（即已经获取到了eth hash和blockNum），还未发起，此时状态为NA */}
                                {this.getStatusNum(status) === 1 && <label style={{float: 'right'}}>NA</label>}
                                {/* 2, 3三种状态中，都已经得到了appChain的hash，显示哈希 */}
                                {(this.getStatusNum(status) > 1 && this.getStatusNum(status) < 4) &&
                                <label style={{float: 'right'}}>{microscopeLink}</label>}
                                {/* 4 状态表示失败，可能有hash也可能没有，显示或不显示都在后mark为失败 */}
                                {this.getStatusNum(status) === 4 &&
                                <label style={{float: 'right'}}>{microscopeLink} (Failed)</label>}
                            </div>
                        </div>
                    </div>
                )
            }
        }
        return (
            <div className='e2a'>
                <div className="transactionMeta" onClick={this.toggleDetails}>
                    <div className="transactionMetaInfo">
                        <label>-{this.parseValue(value)} eth -> +{this.parseValue(value)} ebc </label>
                        <label><Icon type="clock-circle" theme="outlined"/>{this.parseTimeStamp(startedTime)}
                        </label>
                    </div>
                    <TxStatusBar {...txStatusBarInfo}/>
                </div>
                {showTxDetail(this.state.showDetails)}
            </div>
        );
    };
}

export default TransactionE2A;
