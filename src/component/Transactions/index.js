import React from 'react'
import {
    Row,
    Col,
} from 'antd'
import TransactionItem from './txItem'
import nervos from '../../nervos'
import './transactions.css'

//check transaction type
const getTxsType = (undecidedTxs) => {
    if (undecidedTxs) {
        if (undecidedTxs.result.ebc_to_eths) {
            return 'ebc_to_eths'
        } else if (undecidedTxs.result.eth_to_ebcs) {
            return 'eth_to_ebcs'
        }
    }
    return 'na'
}

//check if transactions are available
const isTxsEmpty = (a2eTxs, e2aTxs) => {
    return getTxsType(a2eTxs) !== 'na' && getTxsType(e2aTxs) !== 'na'
}

class Transactions extends React.Component {

    constructor() {
        super()
        this.state = {
            ebc2ethTxs: [],
            eth2ebcTxs: [],
            transactions: [],
        }
    }

    // fetch tx data
    componentDidMount() {
        setInterval(() => {
            Promise.all([this.getEbc2EthData(), this.getEth2EbcData()])
                .then(res => {
                    this.setState({transactions: res}
                    )
                })
        }, 500)
    }

    getEbc2EthData() {
        return fetch(nervos.a2eApi + this.props.neuronWebAddress.toLowerCase(), {
            method: "GET"
        }).then(res => res.json())
    }

    getEth2EbcData() {
        return fetch(nervos.e2aApi + this.props.neuronWebAddress.toLowerCase(), {
            method: "GET"
        }).then(res => res.json())
    }

    // get all transactions
    getAllTxs = () => {
        const {transactions} = this.state

        // ebc_to_eth txs
        let tx1 = transactions[0]

        // eth_to_ebc txs
        let tx2 = transactions[1]
        let txs = []

        // make sure all txs are valid type
        if (isTxsEmpty(tx1, tx2)) {
            let tx1Type = getTxsType(tx1)
            let tx2Type = getTxsType(tx2)
            txs = [...tx1.result[tx1Type], ...tx2.result[tx2Type]]
        }

        // identify every single transaction type, ebc2eth or eth2ebc
        for (let i = 0; i < txs.length; i++) {
            if (txs[i].wd_tx_hash) {
                txs[i].txType = 'ebc2eth'
                txs[i].startedTime = txs[i].initialized_timestamp
            } else {
                txs[i].txType = 'eth2ebc'
                txs[i].startedTime = txs[i].eth_block_timestamp * 1000
            }
        }

        txs.sort((a, b) => {
            return b.startedTime - a.startedTime
        })

        return txs
    }

    render() {
        let txs = this.getAllTxs()
        const txsToShow = txs.map((tx, i) => {
            return (
                <Row type="flex" justify="center">
                    <Col span={24}>
                        <TransactionItem {...tx} />
                    </Col>
                </Row>
            )
        })
        return (
            <div>
                {txsToShow}
            </div>
        )
    }
}

export default Transactions
