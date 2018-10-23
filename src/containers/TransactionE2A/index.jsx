import React from 'react';
import './transactionE2A.css';
import '../../styles/tx.css';
import {Icon} from 'antd'
import nervos from "../../nervos";

class TransactionE2A extends React.Component {

    constructor() {
        super();
        this.state = {
            showDetails: false
        }
        this.toggleDetails = this.toggleDetails.bind(this);

        this.STATUS = {
            started: 1,     //'getEthHash and blockNum',
            pending: 2,     //'getAppChain hash',
            completed: 3,   //'getAppChain receipt without err',
            failed: 4       //'failed'
        };
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

    getStatusNum(status) {
        return this.STATUS[status];
    }

    getBlockNumber() {
        nervos.appchain.getBlockNumber().then(res => this.setState({
            currentEthBlockNum: res
        }));
        setTimeout(_ => this.getBlockNumber(), 5000);
    }

    componentDidMount() {
        this.getBlockNumber();
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
        return (value / 1e18).toFixed(2)
    }

    render() {

        return (
            <div className='e2a'>
                <div className="transactionMeta" onClick={this.toggleDetails}>
                    <div className="transactionMetaInfo">
                        <label>-{this.parseValue(this.props.value)} eth ->
                            +{this.parseValue(this.props.value)} ebc </label>
                        <label><Icon type="clock-circle" theme="outlined"/>{this.parseTimeStamp(this.props.startedTime)}
                        </label>
                    </div>
                    <div className="transctionMetaStatus">
                        <div className="transctionMetaSingleStatus">
                            {/* 初始状态为已经得到eth的block，eth交易已经入块 */}
                            <div>转账发起</div>
                            <img src={"/Rectangle6.png"} alt="enabled"/>
                            {/* 该状态页不会出现失败信息 */}
                        </div>

                        <div className="transctionMetaSingleStatus">
                            {/* 初始状态已经得到eth的block，即开始等待30个确认 */}
                            {this.getStatusNum(this.props.status) === 1 && <div>转账确认中</div>}
                            {this.getStatusNum(this.props.status) === 1 &&
                            <img src={"/Rectangle6_disable.png"} alt="disabled"/>}

                            {/* 如果发出了appchain交易，后端已经确认转账，即点亮 */}
                            {(this.getStatusNum(this.props.status) === 2 || this.getStatusNum(this.props.status) === 3) &&
                            <div>转账确认</div>}
                            {(this.getStatusNum(this.props.status) === 2 || this.getStatusNum(this.props.status) === 3) &&
                            <img src={"/Rectangle6.png"} alt="disabled"/>}

                            {/* 该状态页先不考虑失败状态，因为没有指定失败原因 */}
                        </div>

                        <div className="transctionMetaSingleStatus">
                            {/* 如果得到hash则显示兑换确认中，但是不点亮 */}
                            {this.getStatusNum(this.props.status) === 1 && <div>&nbsp;&nbsp;&nbsp;-- </div>}
                            {this.getStatusNum(this.props.status) === 1 &&
                            <img src={"/Rectangle6_disable.png"} alt="disabled"/>}
                            {/* 如果得到appchain hash则显示兑换确认中，但是不点亮 */}
                            {this.getStatusNum(this.props.status) === 2 && <div>兑换确认中</div>}
                            {this.getStatusNum(this.props.status) === 2 &&
                            <img src={"/Rectangle6_disable.png"} alt="disabled"/>}
                            {/* 如果得到appchain tx receipt，且没有错误，则显示兑换完成，点亮，不需要等待30个确认 */}
                            {this.getStatusNum(this.props.status) === 3 && <div>兑换完成</div>}
                            {this.getStatusNum(this.props.status) === 3 && <img src={"/Rectangle6.png"} alt="enabled"/>}
                            {/* 如果得到appchain tx receipt，有错误或者别的原因，则显示兑换失败，不点亮 */}
                            {this.getStatusNum(this.props.status) === 4 && <div>兑换失败</div>}
                            {this.getStatusNum(this.props.status) === 4 &&
                            <img src={"/Rectangle6_disable.png"} alt="disabled"/>}
                        </div>
                    </div>
                </div>
                {this.state.showDetails &&
                <div className="transactionDetail">
                    <div className="transactionDetailItems">
                        <div className="transactionDetailSingleItem">
                            <label>转账发起：</label>
                            <label style={{float: 'right'}}>{this.parseTimeStamp(this.props.startedTime)}</label>
                        </div>
                        <div className="transactionDetailSingleItem">
                            <label>交易哈希：</label>
                            <label style={{float: 'right'}}>{this.props.eth_tx_hash}</label>
                        </div>
                        <div className="transactionDetailSingleItem">
                            <label>转账确认：</label>
                            {/* 初始状态（即已经获取到了eth hash和blockNum），是要显示 confirmation 数量*/}
                            {this.getStatusNum(this.props.status) === 1 && <label
                                style={{float: 'right'}}>{Number(this.state.currentEthBlockNum - this.props.eth_block_num)}/30</label>}
                            {(this.getStatusNum(this.props.status) > 1 && this.getStatusNum(this.props.status) < 5) &&
                            <label style={{float: 'right'}}>Number(this.state.currentEthBlockNum - this.props.eth_block_num)}/30</label>}
                            {/* 这以上的三个信息页面不需要显示失败状态，因为两个已经显示，这个只要交易能取到，肯定要显示块高 */}
                        </div>
                        <div className="transactionDetailSingleItem">
                            <label>转账确认：</label>
                            {/* 初始状态（即已经获取到了eth hash和blockNum），还未发起，此时状态为NA */}
                            {this.getStatusNum(this.props.status) === 1 && <label style={{float: 'right'}}>NA</label>}
                            {/* 非初始状态，此时状态为 Completed，因为 appChain 上的交易，只要发起就可以确认，不存在pending状态 */}
                            {(this.getStatusNum(this.props.status) > 1 && this.getStatusNum(this.props.status) < 4) &&
                            <label style={{float: 'right'}}>Completed</label>}
                            {/* 5 状态表示失败，可能原因很多，显示失败状态在这里 */}
                            {this.getStatusNum(this.props.status) === 4 &&
                            <label style={{float: 'right'}}>Failed</label>}
                        </div>
                        <div className="transactionDetailSingleItem">
                            <label>交易哈希：</label>
                            {/* 初始状态（即已经获取到了eth hash和blockNum），还未发起，此时状态为NA */}
                            {this.getStatusNum(this.props.status) === 1 && <label style={{float: 'right'}}>NA</label>}
                            {/* 2, 3三种状态中，都已经得到了appChain的hash，显示哈希 */}
                            {(this.getStatusNum(this.props.status) > 1 && this.getStatusNum(this.props.status) < 4) &&
                            <label style={{float: 'right'}}>{this.props.ac_tx_hash}</label>}
                            {/* 4 状态表示失败，可能有hash也可能没有，显示或不显示都在后mark为失败 */}
                            {this.getStatusNum(this.props.status) === 4 &&
                            <label style={{float: 'right'}}>{this.props.ac_tx_hash} (Failed)</label>}
                        </div>
                    </div>
                </div>
                }
            </div>
        );
    };
}

export default TransactionE2A;
