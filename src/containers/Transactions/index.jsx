import React from 'react';
import TransactionA2E from '../TransactionA2E/index';
import TransactionE2A from '../TransactionE2A/index';

class Transactions extends React.Component {
    constructor() {
        super();
        this.state = {
            ebc2ethTxs: [],
            eth2ebcTxs: [],
            transactions: [],
        }
    }

    render() {
        console.log("Transactions rendering... Getting transactions from Db");
        let { transactions } = this.state;

        let tx1 = transactions[0];
        let tx2 = transactions[1];

        let txs = [];
        if (tx1 != undefined && tx2 != undefined && tx1.data != undefined && tx2.data != undefined) {
            txs = [...tx1.data, ...tx2.data]
        } else if (tx1 != undefined && tx1.data != undefined) {
            txs = [...tx1.data]
        } else if (tx2 != undefined && tx2.data != undefined) {
            txs = [...tx2.data]
        }

        for (let i = 0; i < txs.length; i++) {
            if (txs[i]['wd_tx_hash'] != undefined) {
                txs[i]['txType'] = 'ebc2eth';
                txs[i]['startedTime'] = txs[i]['initialized_at'];
            } else {
                txs[i]['txType'] = 'eth2ebc';
                txs[i]['startedTime'] = txs[i]['eth_block_timestamp'];
            }
        }

        txs.sort(function(a, b) {
            return a['startedTime'] - b['startedTime'];
        })

        console.log(txs);
                
        const txsToShow = txs.map((tx, i) => {
            if(tx['txType'] === 'ebc2eth') {
                return <TransactionA2E key={i} currentNum={this.state.currentEthBlockNum} {...tx} />
            } else if (tx['txType'] === 'eth2ebc') {
                return <TransactionE2A key={i} currentNum={this.state.currentEthBlockNum} {...tx} />
            }
        })

        return(
            <div>
                <h1>These are transactions</h1>
                {txsToShow}
            </div>
        );
    };

    componentDidMount() {
        // Promise.all([this.getEbc2EthData(), this.getEth2EbcData()]).then(res => {console.log(res)})
        Promise.all([this.getEbc2EthData(), this.getEth2EbcData()])
            .then(res => this.setState({
                transactions: res
            }))
    }

    getEbc2EthData() {
        return fetch("https://easy-mock.com/mock/5bc588a93a429b1815e0f4d9/etherbridge/get-ebc-to-ether", {
            method: "GET"
        }).then(res => res.json());
    }

    getEth2EbcData() {
        return fetch("https://easy-mock.com/mock/5bc588a93a429b1815e0f4d9/etherbridge/get-ether-to-ebc", {
            method: "GET"
        }).then(res => res.json());
    }

}

export default Transactions;