import React from "react"

const imgPath = './Rectangle6.png'
const imgPathDisabled = './Rectangle6_disable.png'

const selectStage = (txType) => {
    return txType === 'eth2ebc' ?
        ['eth2ebcStage1', 'eth2ebcStage2'] :
        ['ebc2ethStage1', 'ebc2ethStage2']
}

class TxStatusBar extends React.Component {

    isTxHashExist = () => {
        return this.props.acTxHash || this.props.ethTxHash
    }

    render() {
        const {
            status,
            txType,
            transactionType,
        } = this.props

        const s = {
            eth2ebcStage1: {
                started: ['转账确认中', imgPathDisabled, 'disabled'],
                pending: ['转账确认', imgPath, 'enabled'],
                completed: ['转账确认', imgPath, 'enabled'],
                failed: ['转账失败', imgPath, 'enabled'],
            },
            eth2ebcStage2: {
                started: ['--', imgPathDisabled, 'disabled'],
                pending: ['兑换确认中', imgPathDisabled, 'disabled'],
                completed: ['兑换完成', imgPath, 'enabled'],
                failed: [this.isTxHashExist() ? '兑换失败' : '--', imgPathDisabled, 'disabled'],
            },
            ebc2ethStage1: {
                started: ['--', imgPathDisabled, 'disabled'],
                pending: ['兑换发起', imgPath, 'enabled'],
                completed: ['兑换发起', imgPath, 'enabled'],
                success: ['兑换发起', imgPath, 'enabled'],
                failed: this.isTxHashExist() ? ['交易成功', imgPath, 'enabled'] : ['交易失败', imgPathDisabled, 'disabled'],
            },
            ebc2ethStage2: {
                started: ['--', imgPathDisabled, 'disabled'],
                pending: ['兑换确认中', imgPathDisabled, 'disabled'],
                completed: ['兑换确认中', imgPathDisabled, 'disabled'],
                success: ['兑换完成', imgPath, 'enabled'],
                failed: [this.isTxHashExist() ? '兑换失败' : '--', imgPathDisabled, 'disabled'],
            }
        }

        return (
            <div className="transctionMetaStatus">
                <div className="transctionMetaSingleStatus">
                    <div>{transactionType[txType][2]}</div>
                    <img src={imgPath} alt="enabled"/>
                </div>
                <div className="transctionMetaSingleStatus">
                    <div>{s[selectStage(txType)[0]][status][0]}</div>
                    <img src={s[selectStage(txType)[0]][status][1]}
                         alt={s[selectStage(txType)[0]][status][2]}
                    />
                </div>
                <div className="transctionMetaSingleStatus">
                    <div>{s[selectStage(txType)[1]][status][0]}</div>
                    <img src={s[selectStage(txType)[1]][status][1]}
                         alt={s[selectStage(txType)[1]][status][2]}
                    />
                </div>
            </div>
        )
    }

}

export default TxStatusBar
