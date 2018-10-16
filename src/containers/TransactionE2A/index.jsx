import React from 'react';
import './transactionE2A.css';

const transfer = {

    border: 'black 1px solid',
    height: '60%',
    width: '90%',
    margin: '0 auto'
};

const status = {
    marginLeft: '10%',
    border: 'black 1px solid',
}

const detail = {
    border: 'black 1px solid',
}

const detailShow = {
    display: 'none'
}

const detailtext = {
    textAlign: "left"
}


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

        return(
            <div>
                <div id="wrapperStyle">
                    
                    <div onClick={this.toggleDetails}>
                        <div id="infoStyle">
                            <span>ether -> ebc &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>value &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            <span>Time</span>
                        </div>

                        <div id="statusStyle">
                            <span style={status}>
                                <label>转账发起</label>    
                            </span>
                            <span style={status}>
                                <label>转账确认</label>
                            </span>
                            <span style={status}>
                                <label>兑换完成</label>    
                                <label>  --  </label>
                            </span>
                        </div>    
                    </div>

                    <div style={detailShow}>
                        <div style={detail}>
                            <p style={detailtext}>转账发起：时间</p>
                            <p style={detailtext}>交易哈希：xxxxxxxxxx</p>
                            <p style={detailtext}>转账确认：x/x</p>
                            <p style={detailtext}>交易哈希：xxxxxxxxxx</p>    
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default TransactionE2A;
