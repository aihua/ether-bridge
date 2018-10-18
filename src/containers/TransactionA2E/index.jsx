import React from 'react';
import "antd/dist/antd.css";
import "./transactionA2E.css";
import nervos from '../../nervos';

const transfer = {

    // border: 'black 1px solid',
    height: '60%',
    width: '90%',
    margin: '0 auto'
};

const status = {
    marginLeft: '10%',
    // border: 'black 1px solid',
}

const detail = {
    // border: 'black 1px solid',
}

const detailShow = {
    display: 'none'
}

const detailtext = {
    textAlign: "left"
}

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
                <div id="wrapperStyle">
                    
                    <div onClick={this.toggleDetails}>
                        <div id="infoStyle">
                            <span>ebc -> ether &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>{this.props.value} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>{this.props.startedTime}</span>
                        </div>

                        <div id="statusStyle">
                            <span style={status}>
                            {/* 这个状态永远是亮的，因为只要发现了event log即为started状态 */}
                                <label>转账确认</label>
                            </span>
                            <span style={status}>
                            {/* 检测到pending或者completed这个状态会亮 */}
                                <label>兑换发起</label>    
                            </span>
                            <span style={status}>
                            {/* 检测到succeeded并且x大于等于三十这个状态会亮 */}
                                <label></label>
                                <label>兑换完成</label>    
                                <label>  --  </label>
                            </span>
                        </div>    
                    </div>

                    <div style={detailShow}>
                        <div style={detail}>
                            <p style={detailtext}>转账发起：{this.props.startedTime} </p>
                            <p style={detailtext}>交易哈希：{this.props.wd_tx_hash}</p>
                            <p style={detailtext}>转账确认：{this.state.currentEthBlockNum - this.props.eth_block_num}/30</p>
                            <p style={detailtext}>交易哈希：{this.props.eth_tx_hash}</p>    
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}
export default TransactionA2E;