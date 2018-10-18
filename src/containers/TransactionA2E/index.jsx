import React from 'react';
// import "./transactionA2E.css";
import nervos from '../../nervos';
import '../../styles/tx.css';

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

    getBlockNumber() {
        nervos.appchain.getBlockNumber().then(res => this.setState({
            currentEthBlockNum: res
        }));
    }

    getStatusNum(status) {
        return this.STATUS[status];
    }

    componentDidMount() {
        this.getBlockNumber();
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


        console.log("address: " + this.props.address);
        console.log("eth_block_num: " + this.props.eth_block_num);
        console.log("eth_tx_hash: " + this.props.eth_tx_hash);
        console.log("eth_tx_timestamp: " + this.props.eth_tx_timestamp);
        console.log("id: " + this.props.id);
        console.log("initialized_timestamp: " + this.initialized_timestamp);
        console.log("startedTime: " + this.props.startedTime);
        console.log("status: " + this.props.status);
        console.log("status_updated_at: " + this.props.status_updated_at);
        console.log("txType: " + this.props.txType);
        console.log("value: " + this.props.value);
        console.log("wd_block_num: " + this.props.wd_block_num);
        console.log("wd_tx_hash: " + this.props.wd_tx_hash);
        console.log("wdid: " + this.props.wdid);

        return(
            <div>
                <div className="transactionMeta" onClick={this.toggleDetails}>
                    <div className="transactionMetaInfo">
                        <label><label>-{this.props.value} ebc -> +{this.props.value} eth </label></label>
                        <label>{this.props.startedTime}</label> 
                    </div>
                    <div className="transctionMetaStatus">
                        <div className="transctionMetaSingleStatus">
                        {/* 这个状态永远是亮的，因为只要发现了event log即为started状态 */}
                            <div>转账确认</div>
                            <img src={"/Rectangle6.png"}/>
                        </div>
                        
                        <div className="transctionMetaSingleStatus">
                            {/* 拿到eth hash之前为 -- */}
                            {this.getStatusNum(this.props.status) == 1 && <div>&nbsp;&nbsp;&nbsp;&nbsp;--</div>}
                            {this.getStatusNum(this.props.status) == 1 && <img src={"/Rectangle6_disable.png"}/>}

                            {/* 拿到eth hash之后即点亮，并切换为兑换发起 */}
                            {(this.getStatusNum(this.props.status) > 1 && this.getStatusNum(this.props.status) < 5) && <div>兑换发起</div>}
                            {(this.getStatusNum(this.props.status) > 1 && this.getStatusNum(this.props.status) < 5) && <img src={"/Rectangle6.png"}/>}
                        
                            <img src={"/Rectangle6.png"} style={{width:'240px',height:'46px',display:'none'}}/>
                        </div>

                        <div className="transctionMetaSingleStatus">
                            {/* 得到eth hash 以前为 -- */}
                            {this.getStatusNum(this.props.status) == 1 && <div>&nbsp;&nbsp;&nbsp;&nbsp;-- </div>}
                            {this.getStatusNum(this.props.status) == 1 && <img src={"/Rectangle6_disable.png"}/>}

                            {/* 得到eth hash 以后切换为兑换确认中，但不点亮 */}
                            {(this.getStatusNum(this.props.status) == 2 || this.getStatusNum(this.props.status) == 3) && <div>兑换确认中</div>}
                            {(this.getStatusNum(this.props.status) == 2 || this.getStatusNum(this.props.status) == 3) && <img src={"/Rectangle6_disable.png"}/>}

                            {/* 得到30个确认，切换为兑换完成，并且点亮 */}
                            {this.getStatusNum(this.props.status) == 4 && <div>兑换完成</div>}
                            {this.getStatusNum(this.props.status) == 4 && <img src={"/Rectangle6.png"}/>}

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
                                <label style={{float:'right'}}>{this.props.wd_tx_hash}</label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>兑换确认：</label>
                                {this.getStatusNum(this.props.status) == 1 && <label style={{float:'right'}}>NA</label>}
                                {this.getStatusNum(this.props.status) == 2 && <label style={{float:'right'}}>0/30</label>}
                                {this.getStatusNum(this.props.status) == 3 && <label style={{float:'right'}}>{this.getBlockNumber() - this.props.eth_block_num}/30</label>}
                                {this.getStatusNum(this.props.status) == 4 && <label style={{float:'right'}}>30/30</label>}
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>转账确认：</label>
                                <label style={{float:'right'}}>
                                {this.getStatusNum(this.props.status) == 1 && <label style={{float:'right'}}>NA</label>}
                                {this.getStatusNum(this.props.status) == 2 && <label style={{float:'right'}}>尚未入块</label>}
                                {this.getStatusNum(this.props.status) == 3 && <label style={{float:'right'}}>Pending</label>}
                                {this.getStatusNum(this.props.status) == 4 && <label style={{float:'right'}}>Completed</label>}
                                </label>
                            </div>
                            <div className="transactionDetailSingleItem">
                                <label>交易哈希：</label>
                                <label style={{float:'right'}}>
                                    {this.getStatusNum(this.props.status) == 1 && <label style={{float:'right'}}>NA</label>}
                                    {(this.getStatusNum(this.props.status) > 1  && this.getStatusNum(this.props.status) < 5) && <label style={{float:'right'}}>{this.props.eth_tx_hash}</label>}
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