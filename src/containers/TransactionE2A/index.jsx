import React from 'react';
import './transactionE2A.css';
import '../../styles/tx.css';
import { Row, Col } from 'antd';

class TransactionE2A extends React.Component {

    constructor(){
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
        if(this.state.showDetails) {
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

    render() {
        const detailShow = this.state.showDetails ? {} : {display: 'none'};

        console.log("ac_block_number: " + this.props.ac_block_number);
        console.log("ac_block_timestamp: " + this.props.ac_block_timestamp);
        console.log("ac_tx_at: " + this.props.ac_tx_at);
        console.log("ac_tx_hash: " + this.props.ac_tx_hash);
        console.log("props.address: " + this.props.address);
        console.log("eth_block_num: " + this.props.eth_block_num);
        console.log("eth_block_timestamp: " + this.props.eth_block_timestamp);
        console.log("eth_tx_hash: " + this.props.eth_tx_hash);
        console.log("id: " + this.props.id);
        console.log("startedTime: " + this.props.startedTime);
        console.log("status: " + this.props.status);
        console.log("status_update_at: " + this.props.status_update_at);
        console.log("txType: " + this.props.txType);
        console.log("value: " + this.props.value);
        console.log("Current eth block Number: " + this.state.currentEthBlockNum);
        
        return(
            <div>
                <div className="transactionMeta" onClick={this.toggleDetails}>
                    <div className="transactionMetaInfo">
                        <label>-{this.props.value} eth -> +{this.props.value} ebc </label>
                        <label>{this.props.startedTime}</label> 
                    </div>
                    <div className="transctionMetaStatus">
                        <div className="transctionMetaSingleStatus">
                            {/* 初始状态为已经得到eth的block，eth交易已经入块 */}
                            <div>转账发起</div>
                            <img src={"/Rectangle6.png"}/>
                        </div>
                        
                        <div className="transctionMetaSingleStatus">
                            {/* 初始状态已经得到eth的block，即开始等待30个确认 */}
                            {this.getStatusNum(this.props.status) == 1 && <div>转账确认中</div>}
                            {this.getStatusNum(this.props.status) == 1 && <img src={"/Rectangle6_disable.png"}/>}

                            {/* 如果发出了appchain交易，后端已经确认转账，即点亮 */}
                            {(this.getStatusNum(this.props.status) == 2 && this.getStatusNum(this.props.status) == 3) && <div>转账确认</div>}
                            {(this.getStatusNum(this.props.status) == 2 && this.getStatusNum(this.props.status) == 3) && <img src={"/Rectangle6.png"}/>}
                        </div>

                        <div className="transctionMetaSingleStatus">
                            {/* 如果得到hash则显示兑换确认中，但是不点亮 */}
                            {this.getStatusNum(this.props.status) == 1 && <div>&nbsp;&nbsp;&nbsp;-- </div>}
                            {this.getStatusNum(this.props.status) == 1 && <img src={"/Rectangle6_disable.png"}/>}
                            {/* 如果得到appchain hash则显示兑换确认中，但是不点亮 */}
                            {this.getStatusNum(this.props.status) == 2 && <div>兑换确认中</div>}
                            {this.getStatusNum(this.props.status) == 2 && <img src={"/Rectangle6_disable.png"}/>}
                            {/* 如果得到appchain tx receipt，且没有错误，则显示兑换完成，点亮，不需要等待30个确认 */}
                            {this.getStatusNum(this.props.status) == 3 && <div>兑换完成</div>}
                            {this.getStatusNum(this.props.status) == 3 && <img src={"/Rectangle6.png"}/>}
                        </div>
                    </div>
                </div>
                {this.state.showDetails &&
                    <div className="transactionDetail">
                        <div className="transactionDetailItems">
                            <div className="transactionDetailSingleItem">
                                <label>转账发起：</label>
                                <label style={{float:'right'}}>{this.props.startedTime}</label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>交易哈希：</label> 
                                <label style={{float:'right'}}>{this.props.eth_tx_hash}</label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>转账确认：</label>
                                <label style={{float:'right'}}>x/30</label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>转账确认：</label>
                                <label style={{float:'right'}}>Pending</label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>交易哈希：</label>
                                <label style={{float:'right'}}>{this.props.ac_tx_hash}</label> 
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };
}

export default TransactionE2A;
