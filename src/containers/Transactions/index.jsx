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

    //get the type of txs" ebc_to_eths or eth_to_ebcs
    getTxsType(undecidedTxs) {
        if (undecidedTxs != undefined && undecidedTxs['result'] != undefined && undecidedTxs['result']['ebc_to_eths']!= undefined) {
            return 'ebc_to_eths';
        } else if (undecidedTxs != undefined && undecidedTxs['result'] != undefined && undecidedTxs['result']['eth_to_ebcs']!= undefined) {
            return 'eth_to_ebcs';
        } else {
            return 'na';
        }
    }

    //check if transactions are available
    isTxsEmpty(unsuredTxs) {
        return this.getTxsType(unsuredTxs) == 'na'
    }

    render() {
        console.log("Transactions rendering... Getting transactions from Db");
        let { transactions } = this.state;
        let tx1 = transactions[0];
        let tx2 = transactions[1];
        

        let txs = [];
        if (!this.isTxsEmpty(tx1) && !this.isTxsEmpty(tx2)) {
            let tx1Type = this.getTxsType(tx1);
            let tx2Type = this.getTxsType(tx2);
            txs = [...tx1['result'][tx1Type], ...tx2['result'][tx2Type]];
        }

        for (let i = 0; i < txs.length; i++) {
            if (txs[i]['wd_tx_hash'] != undefined) {
                txs[i]['txType'] = 'ebc2eth';
                txs[i]['startedTime'] = txs[i]['initialized_timestamp'];
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
        // return fetch("https://easy-mock.com/mock/5bc588a93a429b1815e0f4d9/etherbridge/get-ebc-to-ether", {
        //     method: "GET"
        // }).then(res => res.json());
        return fetch("http://47.97.171.140:17400/api/v1/ebc_to_eths", {
            method: "GET"
        }).then(res => res.json());
    }

    getEth2EbcData() {
        // return fetch("https://easy-mock.com/mock/5bc588a93a429b1815e0f4d9/etherbridge/get-ether-to-ebc", {
        //     method: "GET"
        // }).then(res => res.json());
        return fetch("http://47.97.171.140:17400/api/v1/eth_to_ebcs?page=1&per_page=20", {
            method: "GET"
        }).then(res => res.json());
    }

}

export default Transactions;