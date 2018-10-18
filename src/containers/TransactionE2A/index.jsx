import React from 'react';
import './transactionE2A.css';
import { Row, Col } from 'antd';

class TransactionE2A extends React.Component {

    constructor(){
        super();
        this.state = {
            showDetails: false
        }
        this.toggleDetails = this.toggleDetails.bind(this);
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
        console.log("initialized_at: " + this.props.initialized_at);
        console.log("startedTime: " + this.props.startedTime);
        console.log("status: " + this.props.status);
        console.log("status_update_at: " + this.props.status_update_at);
        console.log("txType: " + this.props.txType);
        console.log("value: " + this.props.value);
        console.log("Current eth block Number: " + this.state.currentEthBlockNum);
        
        const left = 3;

        let st1 = {}
        return(
            <div>
                <div className="transactionMeta" onClick={this.toggleDetails}>
                    <div className="transactionMetaInfo">
                        <label>value</label>
                        <label>Time</label> 
                    </div>
                    <div className="transctionMetaStatus">
                        <div className="transctionMetaSingleStatus">
                            <div>转账发起</div>
                            <img src={"/Rectangle6.png"}/>
                        </div>
                        
                        <div className="transctionMetaSingleStatus">
                            <div>转账确认中</div>
                            <label style={{display:'none'}}>转账确认</label>    
                            <img src={"/Rectangle6_disable.png"}/>
                            <img src={"/Rectangle6.png"} style={{width:'240px',height:'46px',display:'none'}}/>
                        </div>

                        <div className="transctionMetaSingleStatus">
                            <div>&nbsp;&nbsp;&nbsp;-- </div>
                            <label style={{display:'none'}}>兑换确认中</label>
                            <label style={{display:'none'}}>兑换完成</label>    
                            <img src={"/Rectangle6_disable.png"}/>
                            <img src={"/Rectangle6.png"} style={{width:'240px',height:'46px',display:'none'}}/>
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
