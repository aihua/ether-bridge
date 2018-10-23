import React from 'react';
import {Row, Col} from 'antd';
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
        if (undecidedTxs !== undefined && undecidedTxs['result'] !== undefined && undecidedTxs['result']['ebc_to_eths'] !== undefined) {
            return 'ebc_to_eths';
        } else if (undecidedTxs !== undefined && undecidedTxs['result'] !== undefined && undecidedTxs['result']['eth_to_ebcs'] !== undefined) {
            return 'eth_to_ebcs';
        } else {
            return 'na';
        }
    }

    //check if transactions are available
    isTxsEmpty(unsuredTxs) {
        return this.getTxsType(unsuredTxs) === 'na'
    }

    render() {
        console.log("Transactions rendering... Getting transactions from Db");
        let {transactions} = this.state;
        let tx1 = transactions[0];
        let tx2 = transactions[1];

        let txs = [];
        if (!this.isTxsEmpty(tx1) && !this.isTxsEmpty(tx2)) {
            let tx1Type = this.getTxsType(tx1);
            let tx2Type = this.getTxsType(tx2);
            txs = [...tx1['result'][tx1Type], ...tx2['result'][tx2Type]];
        }
        for (let i = 0; i < txs.length; i++) {
            if (txs[i]['wd_tx_hash'] !== undefined) {
                txs[i]['txType'] = 'ebc2eth';
                txs[i]['startedTime'] = txs[i]['initialized_timestamp'];
            } else {
                txs[i]['txType'] = 'eth2ebc';
                txs[i]['startedTime'] = txs[i]['eth_block_timestamp'] * 1000;
            }
        }
        txs.sort((a, b) => {
            return b['startedTime'] - a['startedTime'];
        })
        console.log(txs);

        const txsToShow = txs.map((tx, i) => {
            if (tx['txType'] === 'ebc2eth') {
                return <Row type="flex" justify="center">
                    <Col span={24}>
                        <TransactionA2E key={i} currentNum={this.state.currentEthBlockNum} {...tx} />
                    </Col>
                </Row>
            } else if (tx['txType'] === 'eth2ebc') {
                return <Row type="flex" justify="center">
                    <Col span={24}>
                        <TransactionE2A key={i} currentNum={this.state.currentEthBlockNum} {...tx} />
                    </Col>
                </Row>
            } else {
                return <Row type="flex" justify="center">
                    <Col span={24}>
                        <div>Cannot identify the type of transaction.</div>
                    </Col>
                </Row>
            }
        })
        return (
            <div>
                {txsToShow}
            </div>
        );
    };

    getTransactions() {
        Promise.all([this.getEbc2EthData(), this.getEth2EbcData()])
            .then(res => this.setState({transactions: res}));
        setTimeout(_ => this.getTransactions(), 5000);
    }

    componentDidMount() {
        this.getTransactions();
    }

    getEbc2EthData() {
        return fetch(`https://ether-bridge-server.staging.cryptape.com/api/v1/eth_to_ebcs/${this.props.neuronWebAddress.toLowerCase()}`, {
            method: "GET"
        }).then(res => res.json());

        // return fetch(`http://47.97.171.140:17400/api/v1/ebc_to_eths/${this.props.neuronWebAddress.toLowerCase()}`, {
        //     method: "GET"
        // }).then(res => res.json());
    }

    getEth2EbcData() {
        return fetch(`https://ether-bridge-server.staging.cryptape.com/api/v1/ebc_to_eths/${this.props.neuronWebAddress.toLowerCase()}`, {
            method: "GET"
        }).then(res => res.json());

        // return fetch(`http://47.97.171.140:17400/api/v1/eth_to_ebcs/${this.props.neuronWebAddress.toLowerCase()}`, {
        //     method: "GET"
        // }).then(res => res.json());
    }
}

export default Transactions;