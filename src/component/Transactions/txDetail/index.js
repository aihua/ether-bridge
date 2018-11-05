import React from "react"

const queryUrl = {
    acTxHash: 'http://microscope.cryptape.com/#/transaction/',
    ethTxHash: 'https://kovan.etherscan.io/tx/',
}

const queryLink = (txHash, txHashType) => {
    return (
        <a target="_blank" rel="noopener noreferrer"
           href={queryUrl[txHashType] + txHash}>{txHash}</a>
    )
}
const blockNumberStatus = (currentEthBlockNum, ethBlockNum) => {
    let blockNumberInterval = Number(currentEthBlockNum - ethBlockNum)
    let displayResult = blockNumberInterval > 30 ? '已确认/30' : blockNumberInterval + '/30'
    return (
        <label>
            {displayResult}
        </label>
    )
}

const txConfirmPanel = (txType) => {
    return txType === 'eth2ebc' ? 'confirmE2A' : 'confirmA2E'
}

class TxDetail extends React.Component {

    selectQueryLink = (txType) => {
        let qLink = [
            queryLink(this.props.ethTxHash, 'ethTxHash'),
            queryLink(this.props.acTxHash || this.props.wdTxHash, 'acTxHash')
        ]

        return txType === 'eth2ebc' ? [qLink[0], qLink[1]] : [qLink[1], qLink[0]]
    }

    render() {

        const {
            status,
            startedTime,
            ethBlockNum,
            txType,
            transactionType,
            currentEthBlockNum,
        } = this.props

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
                completed: blockNumberStatus(currentEthBlockNum, ethBlockNum),
                success: blockNumberStatus(currentEthBlockNum, ethBlockNum),
                failed: 'Failed',
            },
            txHash: {
                started: 'NA',
                pending: this.selectQueryLink(txType)[1],
                completed: this.selectQueryLink(txType)[1],
                success: this.selectQueryLink(txType)[1],
                failed: this.selectQueryLink(txType)[1],
            },
        }

        return (
            <div className="transactionDetail">
                <div className="transactionDetailItems">
                    <div className="transactionDetailSingleItem">
                        <label>
                            {transactionType[txType][2] + ':'}
                        </label>
                        <label>
                            {this.props.parseTimeStamp(startedTime)}
                        </label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>
                            {transactionType[txType][0] + ' 交易哈希:'}
                        </label>
                        <label>
                            {this.selectQueryLink(txType)[0]}
                        </label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>
                            {transactionType[txType][3]}
                        </label>
                        {blockNumberStatus(currentEthBlockNum, ethBlockNum)}
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>兑换确认：</label>
                        <label>
                            {s[txConfirmPanel(txType)][status]}
                        </label>
                    </div>
                    <div className="transactionDetailSingleItem">
                        <label>
                            {transactionType[txType][1] + ' 交易哈希:'}
                        </label>
                        <label>
                            {s['txHash'][status]}
                        </label>
                    </div>
                </div>
            </div>
        )
    }

}

export default TxDetail
