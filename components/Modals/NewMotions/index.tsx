import React, { useState } from 'react'
import * as tyron from 'tyron'
import { useStore } from 'effector-react'
import { useDispatch, useSelector } from 'react-redux'
import {
    $modalNewMotions,
    $xpointsBalance,
    updateModalTx,
    updateModalTxMinimized,
    updateNewMotionsModal,
} from '../../../src/store/modal'
import Close from '../../../src/assets/icons/ic_cross.svg'
import styles from './styles.module.scss'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { setTxId, setTxStatusLoading } from '../../../src/app/actions'
import { RootState } from '../../../src/app/reducers'
import { ZilPayBase } from '../../ZilPay/zilpay-base'
import { useTranslation } from 'next-i18next'
import { $resolvedInfo } from '../../../src/store/resolvedInfo'

function Component() {
    const { t } = useTranslation()
    const modalNewMotions = useStore($modalNewMotions)
    const net = useSelector((state: RootState) => state.modal.net)
    const resolvedInfo = useStore($resolvedInfo)
    const xpointsBalance = useStore($xpointsBalance)
    const dispatch = useDispatch()
    const [motion, setMotion] = useState()
    const [amount, setAmount] = useState()
    const loginInfo = useSelector((state: RootState) => state.modal)

    if (!modalNewMotions) {
        return null
    }

    const handleChange = (e: { target: { value: any; name: string } }) => {
        let value = e.target.value
        if (e.target.name === 'motion') {
            if (
                value.includes('á') ||
                value.includes('é') ||
                value.includes('í') ||
                value.includes('ú') ||
                value.includes('ó')
            ) {
                toast.error('Please input a valid string.', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    toastId: 1,
                })
            } else {
                setMotion(value)
            }
        } else {
            if (isNaN(value)) {
                toast.error('Please input a valid number.', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    toastId: 1,
                })
            } else if (Number(value) > xpointsBalance!) {
                toast.error('Not enough xPoints.', {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    toastId: 1,
                })
            } else {
                setAmount(value)
            }
        }
    }

    const handleSubmit = async () => {
        if (loginInfo.zilAddr !== null) {
            try {
                const zilpay = new ZilPayBase()

                const tx_params = Array()

                const tx_action = {
                    vname: 'action',
                    type: 'String',
                    value: 'new',
                }
                tx_params.push(tx_action)

                let id = await tyron.TyronZil.default.OptionParam(
                    tyron.TyronZil.Option.none,
                    'ByStr32'
                )
                const tx_id = {
                    vname: 'id',
                    type: 'Option ByStr32',
                    value: id,
                }
                tx_params.push(tx_id)

                let motion_ = await tyron.TyronZil.default.OptionParam(
                    tyron.TyronZil.Option.some,
                    'String',
                    motion
                )
                const tx_motion = {
                    vname: 'motion',
                    type: 'Option String',
                    value: motion_,
                }
                tx_params.push(tx_motion)

                const tx_amount = {
                    vname: 'amount',
                    type: 'Uint128',
                    value: String(Number(amount) * 1e12),
                }
                tx_params.push(tx_amount)

                dispatch(setTxStatusLoading('true'))
                updateModalTxMinimized(false)
                updateModalTx(true)
                let tx = await tyron.Init.default.transaction(net)

                await zilpay
                    .call({
                        contractAddress: resolvedInfo?.addr!,
                        transition: 'RaiseYourVoice',
                        params: tx_params as unknown as Record<
                            string,
                            unknown
                        >[],
                        amount: String(0),
                    })
                    .then(async (res) => {
                        dispatch(setTxId(res.ID))
                        dispatch(setTxStatusLoading('submitted'))
                        try {
                            tx = await tx.confirm(res.ID)
                            if (tx.isConfirmed()) {
                                dispatch(setTxStatusLoading('confirmed'))
                                window.open(
                                    `https://v2.viewblock.io/zilliqa/tx/${res.ID}?network=${net}&tab=state`
                                )
                                updateNewMotionsModal(false)
                            } else if (tx.isRejected()) {
                                dispatch(setTxStatusLoading('failed'))
                            }
                        } catch (err) {
                            dispatch(setTxStatusLoading('rejected'))
                            updateModalTxMinimized(false)
                            updateModalTx(true)
                            toast.error(String(err), {
                                position: 'top-right',
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: 'dark',
                            })
                        }
                    })
            } catch (error) {
                updateModalTx(false)
                dispatch(setTxStatusLoading('idle'))
                toast.error(String(error), {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    toastId: 12,
                })
            }
        } else {
            toast.error('some data is missing.', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            })
        }
    }

    return (
        <>
            <div
                onClick={() => updateNewMotionsModal(false)}
                className={styles.outerWrapper}
            />
            <div className={styles.container}>
                <div className={styles.innerContainer}>
                    <div className={styles.headerWrapper}>
                        <div
                            onClick={() => updateNewMotionsModal(false)}
                            className="closeIcon"
                        >
                            <Image
                                alt="ico-close"
                                src={Close}
                                width={15}
                                height={15}
                            />
                        </div>
                        <h5 className={styles.headerTxt}>{t('NEW MOTIONS')}</h5>
                    </div>
                    <div className={styles.contentWrapper}>
                        <div>
                            <h6 className={styles.headerInput}>
                                {t('MOTION')}
                            </h6>
                            <textarea
                                name="motion"
                                onChange={handleChange}
                                className={styles.txtArea}
                            />
                        </div>
                        <div>
                            <h6 className={styles.headerInput}>
                                {t('AMOUNT (BALANCE:')}{' '}
                                <span style={{ color: '#ffff32' }}>
                                    {xpointsBalance}
                                </span>{' '}
                                <span style={{ textTransform: 'none' }}>x</span>
                                Point{xpointsBalance! > 1 ? 's' : ''})
                            </h6>
                            <input
                                name="amount"
                                onChange={handleChange}
                                className={styles.inputAmount}
                            />
                        </div>
                        <div
                            onClick={handleSubmit}
                            style={{ marginTop: '5%' }}
                            className="actionBtn"
                        >
                            <span>{t('SUBMIT')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Component
