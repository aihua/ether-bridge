import React from 'react'
import './transactions.css'
import TransactionItem from './TransactionItem'
import nervos from '../../nervos'
import {
    Row,
    Col,
} from 'antd'

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

    getTxsType(undecidedTxs) {
        if (undecidedTxs) {
            if (undecidedTxs.result.ebc_to_eths) {
                return 'ebc_to_eths'
            } else if (undecidedTxs.result.eth_to_ebcs) {
                return 'eth_to_ebcs'
            }
        }
        return 'na'
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

    //check if transactions are available
    isTxsEmpty(a2eTxs, e2aTxs) {
        return this.getTxsType(a2eTxs) !== 'na' && this.getTxsType(e2aTxs) !== 'na'
    }

    //get all transactions
    getAllTxs = () => {
        let {transactions} = this.state

        let tx1 = transactions[0] //ebc_to_eth txs
        let tx2 = transactions[1] //eth_to_ebc txs

        let txs = []
        // to make sure all txs are valid type
        if (this.isTxsEmpty(tx1, tx2)) {
            let tx1Type = this.getTxsType(tx1)
            let tx2Type = this.getTxsType(tx2)
            txs = [...tx1.result[tx1Type], ...tx2.result[tx2Type]]
        }

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
                        <TransactionItem key={i} {...tx} />
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
