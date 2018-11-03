import React from "react"

const imgPath = './Rectangle6.png'
const imgPathDisabled = './Rectangle6_disable.png'

class TxStatusBar extends React.Component {

    isTxHashExist = () => {
        return this.props.ac_tx_hash || this.props.eth_tx_hash
    }

    render() {
        const {
            status,
            txType,
            transactionType,
        } = this.props

        // eth2ebc stage block info
        const s1 = {
            stage1: {
                started: ['转账确认中', imgPathDisabled, 'disabled'],
                pending: ['转账确认', imgPath, 'enabled'],
                completed: ['转账确认', imgPath, 'enabled'],
                failed: ['转账失败', imgPath, 'enabled'],
            },
            stage2: {
                started: ['--', imgPathDisabled, 'disabled'],
                pending: ['兑换确认中', imgPathDisabled, 'disabled'],
                completed: ['兑换完成', imgPath, 'enabled'],
                failed: [this.isTxHashExist() ? '兑换失败' : '--', imgPathDisabled, 'disabled'],
            }
        }

        //ebc2eth stage block info
        const s2 = {
            stage1: {
                started: ['--', imgPathDisabled, 'disabled'],
                pending: ['兑换发起', imgPath, 'enabled'],
                completed: ['兑换发起', imgPath, 'enabled'],
                success: ['兑换发起', imgPath, 'enabled'],
                failed: this.isTxHashExist() ? ['交易成功', imgPath, 'enabled'] : ['交易失败', imgPathDisabled, 'disabled'],
            },
            stage2: {
                started: ['--', imgPathDisabled, 'disabled'],
                pending: ['兑换确认中', imgPathDisabled, 'disabled'],
                completed: ['兑换确认中', imgPathDisabled, 'disabled'],
                success: ['兑换完成', imgPath, 'enabled'],
                failed: [this.isTxHashExist() ? '兑换失败' : '--', imgPathDisabled, 'disabled'],
            }
        }

        // choose display section according to txType
        let s = {}
        if(txType === 'eth2ebc') {
            s = s1
        } else if(txType === 'ebc2eth') {
            s = s2
        }

        return (
            <div className="transctionMetaStatus">
                <div className="transctionMetaSingleStatus">
                    <div>{transactionType[txType][2]}</div>
                    <img src={imgPath} alt="enabled"/>
                </div>
                <div className="transctionMetaSingleStatus">
                    <div>{s['stage1'][status][0]}</div>
                    <img src={s['stage1'][status][1]} alt={s['stage1'][status][2]}/>
                </div>
                <div className="transctionMetaSingleStatus">
                    <div>{s['stage2'][status][0]}</div>
                    <img src={s['stage2'][status][1]} alt={s['stage2'][status][2]}/>
                </div>
            </div>
        )
    }

}

export default TxStatusBar
