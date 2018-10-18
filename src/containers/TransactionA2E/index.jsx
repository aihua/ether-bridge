import React from 'react';
// import "./transactionA2E.css";
import nervos from '../../nervos';
import '../../styles/tx.css';

class TransactionA2E extends React.Component {


    constructor() {
        super();
        this.state = {
            showDetails: false,
            currentEthBlockNum: 0
        }
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    getBlockNumber() {
        nervos.appchain.getBlockNumber().then(res => this.setState({
            currentEthBlockNum: res
        }));
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
        console.log("initialized_at: " + this.initialized_at);
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
                        <label>Time</label> 
                    </div>
                    <div className="transctionMetaStatus">
                        <div className="transctionMetaSingleStatus">
                        {/* 这个状态永远是亮的，因为只要发现了event log即为started状态 */}
                            <div>转账确认</div>
                            <img src={"/Rectangle6.png"}/>
                        </div>
                        
                        <div className="transctionMetaSingleStatus">
                        {/* 检测到pending或者completed这个状态会亮 */}
                            <div>兑换发起</div>
                            <label style={{display:'none'}}>转账确认</label>    
                            <img src={"/Rectangle6_disable.png"}/>
                            <img src={"/Rectangle6.png"} style={{width:'240px',height:'46px',display:'none'}}/>
                        </div>

                        <div className="transctionMetaSingleStatus">
                        {/* 检测到succeeded并且x大于等于三十这个状态会亮 */}
                            <div>兑换完成 </div>
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
                                <label style={{float:'right'}}>{this.props.wd_tx_hash}</label>
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
                                <label style={{float:'right'}}>{this.props.eth_tx_hash}</label> 
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };
}
export default TransactionA2E;