import React from "react"

class TxDetail extends React.Component {

    constructor() {
        super()
        this.queryUrl = {
            ac_tx_hash: 'http://microscope.cryptape.com/#/transaction/',
            eth_tx_hash: 'https://kovan.etherscan.io/tx/',
        }
    }

    queryLink = (txHash, txHashType) => {
        console.log(txHash)
        return (
            <a target="_blank" rel="noopener noreferrer"
               href={this.queryUrl[txHashType] + txHash}>{txHash}</a>
        )
    }

    render() {

        const {
            status,
            startedTime,
            eth_block_num,
            eth_tx_hash,
            ac_tx_hash,
            currentEthBlockNum,
        } = this.props

        const s = {
            confirm: {
                started: 'NA',
                pending: 'Completed',
                completed: 'Completed',
                failed: 'Failed'
            },
            txHash: {
                started: 'NA',
                pending: this.queryLink(ac_tx_hash, 'ac_tx_hash'),
                completed: this.queryLink(ac_tx_hash, 'ac_tx_hash'),
                failed: 'Failed',
            },
        }
        return (
            <div className="transactionDetail">
                <div className="transactionDetailItems">
                    <div className="transactionDetailSingleItem">
                        <label>转账发起：</label>
                        <label style={{float: 'right'}}>{this.props.parseTimeStamp(startedTime)}</label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>ether 交易哈希：</label>
                        <label style={{float: 'right'}}>{this.queryLink(eth_tx_hash, 'eth_tx_hash')}</label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>转账确认：</label>
                        {/* 初始状态（即已经获取到了eth hash和blockNum），是要显示 confirmation 数量*/}
                        <label style={{float: 'right'}}>
                            {Number(currentEthBlockNum - eth_block_num) > 30
                                ?
                                '已确认'
                                :
                                Number(currentEthBlockNum - eth_block_num)} /30
                        </label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>兑换确认：</label>
                        <label style={{float: 'right'}}>{s['confirm'][status]}</label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>ebc 交易哈希：</label>
                        <label style={{float: 'right'}}>{s['txHash'][status]}</label>
                    </div>
                </div>
            </div>
        )
    }

}

export default TxDetail
