import React from 'react';
// import "./transactionA2E.css";
import '../../styles/tx.css';
import {Icon} from "antd";

class TransactionA2E extends React.Component {


    constructor() {
        super();

        this.STATUS = {
            started: 1,     //'getAppChainHash',
            pending: 2,     //'getEthHash',
            completed: 3,   //'getEthBlockNum',
            success: 4,     //'getEthConfirm',
            failed: 5       //'failed'
        };

        this.state = {
            showDetails: false,
            currentEthBlockNum: 0
        }

        this.toggleDetails = this.toggleDetails.bind(this);
        // this.getStatusNum = this.getStatusNum.bind(this);
    }

    isEthTxExists() {
        return this.eth_tx_hash === undefined ? false : true
    }

    getBlockNumber() {
        // nervos.appchain.getBlockNumber().then(res => this.setState({
        //     currentEthBlockNum: res
        // }));

        window.web3.eth.getBlockNumber((err, res) => this.setState({
            currentEthBlockNum: res
        }));
        setTimeout(_ => this.getBlockNumber(), 5000);
    }


    getStatusNum(status) {
        return this.STATUS[status];
    }

    componentDidMount() {
        this.getBlockNumber();
    }

    toggleDetails() {
        console.log("toggled")
        if (this.state.showDetails) {
            this.setState({
                showDetails: false
            });
        } else {
            this.setState({
                showDetails: true
            });
        }
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

        const imgPath = './Rectangle6.png';
        const imgPathDisabled = './Rectangle6_disable.png';

        const etherScanLink = <a target="_blank" rel="noopener noreferrer"
                                 href={'https://kovan.etherscan.io/tx/' + this.props.eth_tx_hash}>{this.props.eth_tx_hash}</a>
        const microscopeLink = <a target="_blank" rel="noopener noreferrer"
                                  href={'http://microscope.cryptape.com/#/transaction/' + this.props.wd_tx_hash}>{this.props.wd_tx_hash}</a>

        return (
            <div>
                <div className="transactionMeta" onClick={this.toggleDetails}>
                    <div className="transactionMetaInfo">
                        <label>-{this.parseValue(this.props.value)} ebc ->
                            +{this.parseValue(this.props.value)} eth </label>
                        <label><Icon type="clock-circle" theme="outlined"/>{this.parseTimeStamp(this.props.startedTime)}
                        </label>
                    </div>
                    <div className="transctionMetaStatus">
                        <div className="transctionMetaSingleStatus">
                            {/* 这个状态永远是亮的，因为只要发现了event log即为started状态 */}
                            <div>转账确认</div>
                            <img src={imgPath} alt="enabled"/>
                            {/* 该状态页不存在失败状态 */}
                        </div>

                        <div className="transctionMetaSingleStatus">
                            {/* 拿到eth hash之前为 -- */}
                            {this.getStatusNum(this.props.status) === 1 && <div>&nbsp;&nbsp;&nbsp;&nbsp;--</div>}
                            {this.getStatusNum(this.props.status) === 1 &&
                            <img src={imgPathDisabled} alt="disabled"/>}

                            {/* 拿到eth hash之后即点亮，并切换为兑换发起 */}
                            {(this.getStatusNum(this.props.status) > 1 && this.getStatusNum(this.props.status) < 5) &&
                            <div>兑换发起</div>}
                            {(this.getStatusNum(this.props.status) > 1 && this.getStatusNum(this.props.status) < 5) &&
                            <img src={imgPath} alt="enabled"/>}

                            {/* 有eth tx hash，第三步失败 */}
                            {(this.getStatusNum(this.props.status) === 5 && this.isEthTxExists()) && <div>交易成功</div>}
                            {(this.getStatusNum(this.props.status) === 5 && this.isEthTxExists()) &&
                            <img src={imgPath} alt="enabled"/>}

                            {/* 没有eth tx hash，第二部失败 */}
                            {(this.getStatusNum(this.props.status) === 5 && !this.isEthTxExists()) && <div>交易失败</div>}
                            {(this.getStatusNum(this.props.status) === 5 && !this.isEthTxExists()) &&
                            <img src={imgPathDisabled} alt="disabled"/>}

                        </div>

                        <div className="transctionMetaSingleStatus">
                            {/* 得到eth hash 以前为 -- */}
                            {this.getStatusNum(this.props.status) === 1 && <div>&nbsp;&nbsp;&nbsp;&nbsp;-- </div>}
                            {this.getStatusNum(this.props.status) === 1 &&
                            <img src={imgPathDisabled} alt="disabled"/>}

                            {/* 得到eth hash 以后切换为兑换确认中，但不点亮 */}
                            {(this.getStatusNum(this.props.status) === 2 || this.getStatusNum(this.props.status) === 3) &&
                            <div>兑换确认中</div>}
                            {(this.getStatusNum(this.props.status) === 2 || this.getStatusNum(this.props.status) === 3) &&
                            <img src={imgPathDisabled} alt="disabled"/>}

                            {/* 得到30个确认，切换为兑换完成，并且点亮 */}
                            {this.getStatusNum(this.props.status) === 4 && <div>兑换完成</div>}
                            {this.getStatusNum(this.props.status) === 4 && <img src={imgPath} alt="enabled"/>}

                            {/* 没有eth tx hash，第二部失败 */}
                            {(this.getStatusNum(this.props.status) === 5 && !this.isEthTxExists()) &&
                            <div>&nbsp;&nbsp;&nbsp;&nbsp;--</div>}
                            {(this.getStatusNum(this.props.status) === 5 && !this.isEthTxExists()) &&
                            <img src={imgPathDisabled} alt="disabled"/>}

                            {/* 失败页面显示页面，不点亮 */}
                            {(this.getStatusNum(this.props.status) === 5 && this.isEthTxExists()) && <div>兑换失败</div>}
                            {(this.getStatusNum(this.props.status) === 5 && this.isEthTxExists()) &&
                            <img src={imgPath} alt="disabled"/>}

                        </div>
                    </div>
                </div>


                {this.state.showDetails &&
                <div className="transactionDetail">
                    <div className="transactionDetailItems">
                        <div className="transactionDetailSingleItem">
                            <label>转账确认：</label>
                            <label style={{float: 'right'}}>{this.parseTimeStamp(this.props.startedTime)}</label>
                        </div>
                        <div className="transactionDetailSingleItem">
                            <label>ebc 交易哈希：</label>
                            <label style={{float: 'right'}}>{microscopeLink}</label>
                        </div>
                        <div className="transactionDetailSingleItem">
                            <label>兑换发起：</label>
                            {this.getStatusNum(this.props.status) === 1 && <label style={{float: 'right'}}>NA</label>}
                            {this.getStatusNum(this.props.status) === 2 && <label style={{float: 'right'}}>0/30</label>}
                            {(this.getStatusNum(this.props.status) === 3 || this.getStatusNum(this.props.status) === 4) &&
                            <label style={{float: 'right'}}>
                                {Number(this.state.currentEthBlockNum - this.props.eth_block_num) > 30
                                    ? '已确认' : Number(this.state.currentEthBlockNum - this.props.eth_block_num)}/30</label>}
                            {/* 暂不考虑失败状态，虽然有可能这个阶段是成功的，但是标注为Failed */}
                            {this.getStatusNum(this.props.status) === 5 &&
                            <label style={{float: 'right'}}>Failed</label>}
                        </div>
                        <div className="transactionDetailSingleItem">
                            <label>兑换确认：</label>
                            <label style={{float: 'right'}}>
                                {this.getStatusNum(this.props.status) === 1 &&
                                <label style={{float: 'right'}}>NA</label>}
                                {this.getStatusNum(this.props.status) === 2 &&
                                <label style={{float: 'right'}}>尚未入块</label>}
                                {this.getStatusNum(this.props.status) === 3 &&
                                <label style={{float: 'right'}}>Pending</label>}
                                {this.getStatusNum(this.props.status) === 4 &&
                                <label style={{float: 'right'}}>Completed</label>}
                                {/* 失败直接标注 */}
                                {this.getStatusNum(this.props.status) === 5 &&
                                <label style={{float: 'right'}}>Failed</label>}
                            </label>
                        </div>
                        <div className="transactionDetailSingleItem">
                            <label>ether 交易哈希：</label>
                            <label style={{float: 'right'}}>
                                {this.getStatusNum(this.props.status) === 1 &&
                                <label style={{float: 'right'}}>NA</label>}
                                {(this.getStatusNum(this.props.status) > 1 && this.getStatusNum(this.props.status) < 5) &&
                                <label style={{float: 'right'}}>{etherScanLink}</label>}
                                {/* 失败状态把交易哈希 mark Failed */}
                                {this.getStatusNum(this.props.status) === 5 &&
                                <label style={{float: 'right'}}>{etherScanLink} （Failed）</label>}
                            </label>
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    };
}

export default TransactionA2E;
