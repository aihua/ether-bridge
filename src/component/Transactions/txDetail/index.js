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
        // console.log(txHash)
        return (
            <a target="_blank" rel="noopener noreferrer"
               href={this.queryUrl[txHashType] + txHash}>{txHash}</a>
        )
    }

    selectQueryLink = (txType) => {
        let qLink = [
            this.queryLink(this.props.eth_tx_hash, 'eth_tx_hash'),
            this.queryLink(this.props.ac_tx_hash || this.props.wd_tx_hash, 'ac_tx_hash')
        ]

        if(txType === 'eth2ebc') {
            return [qLink[0], qLink[1]]
        } else if(txType === 'ebc2eth') {
            return [qLink[1], qLink[0]]
        }
    }

    blockNumberStatus = (currentEthBlockNum, eth_block_num) => {
        let blockNumberInterval = Number(currentEthBlockNum - eth_block_num)
        let displayResult = blockNumberInterval > 30 ? '已确认/30' : blockNumberInterval + '/30'
        return (
            <label style={{float: 'right'}}>
                {displayResult}
            </label>
        )
    }

    txConfirmPanel = (txType) => {
        // console.log('txType in panel:', txType)
        if(txType === 'eth2ebc') {
            return 'confirmE2A'
        } else if(txType === 'ebc2eth') {
            return 'confirmA2E'
        }
    }


    render() {

        const {
            status,
            startedTime,
            eth_block_num,
            // eth_tx_hash,
            // ac_tx_hash,
            txType,
            transactionType,
            currentEthBlockNum,
        } = this.props

        // this.STATUS = {
        //     started: 1,     //'getAppChainHash',
        //     pending: 2,     //'getEthHash',
        //     completed: 3,   //'getEthBlockNum',
        //     success: 4,     //'getEthConfirm',
        //     failed: 5,       //'failed'
        // };

        const s = {
            confirmE2A: {
                started: 'NA',
                pending: 'Completed',
                completed: 'Completed',
                failed: 'Failed'
            },
            confirmA2E: {
                started: 'NA',
                pending: '尚未入块',
                completed: 'Pending',
                success: 'Completed',
                failed: 'Failed'
            },
            txLaunch: {
                started: 'NA',
                pending: '0/30',
                completed: this.blockNumberStatus(currentEthBlockNum, eth_block_num),
                success: this.blockNumberStatus(currentEthBlockNum, eth_block_num),
                failed: 'Failed',
            },
            txHash: {
                started: 'NA',
                pending: this.selectQueryLink(txType)[1],
                completed: this.selectQueryLink(txType)[1],
                success: this.selectQueryLink(txType)[1],
                failed: this.selectQueryLink(txType)[1] + '(Failed)',
            },
        }

        // const s2 = {
        //     confirmA2E: {
        //         started: 'NA',
        //         pending: 'Completed',
        //         completed: 'Completed',
        //         failed: 'Failed'
        //     },
        //     txLaunch: {
        //         started: 'NA',
        //         pending: '0/30',
        //         completed: this.blockNumberStatus(currentEthBlockNum, eth_block_num),
        //         success: this.blockNumberStatus(currentEthBlockNum, eth_block_num),
        //         failed: 'Failed',
        //     },
        //     txHash: {
        //         started: 'NA',
        //         pending: this.queryLink(eth_tx_hash, 'eth_tx_hash'),
        //         completed: this.queryLink(eth_tx_hash, 'eth_tx_hash'),
        //         success: this.queryLink(eth_tx_hash, 'eth_tx_hash'),
        //         failed: this.queryLink(eth_tx_hash, 'eth_tx_hash') + '(Failed)',
        //     },
        // }

        return (
            <div className="transactionDetail">
                <div className="transactionDetailItems">
                    <div className="transactionDetailSingleItem">
                        <label>{transactionType[txType][2] + ':'}</label>
                        <label style={{float: 'right'}}>{this.props.parseTimeStamp(startedTime)}</label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>{transactionType[txType][0] + ' 交易哈希:'}</label>
                        <label style={{float: 'right'}}>{this.selectQueryLink(txType)[0]}</label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>{transactionType[txType][3]}</label>
                        {/* 初始状态（即已经获取到了eth hash和blockNum），是要显示 confirmation 数量*/}
                        {this.blockNumberStatus(currentEthBlockNum, eth_block_num)}
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>兑换确认：</label>
                        <label style={{float: 'right'}}>{s[this.txConfirmPanel(txType)][status]}</label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>{transactionType[txType][1] + ' 交易哈希:'}</label>
                        <label style={{float: 'right'}}>{s['txHash'][status]}</label>
                    </div>
                </div>
            </div>
        )
    }

}

export default TxDetail
