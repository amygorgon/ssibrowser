import React, { useEffect, useRef, useState } from 'react'
import { useStore } from 'effector-react'
import { toast } from 'react-toastify'
import * as tyron from 'tyron'
import { useDispatch, useSelector } from 'react-redux'
import {
    updateModalTx,
    updateModalTxMinimized,
} from '../../../../../src/store/modal'
import { ZilPayBase } from '../../../../ZilPay/zilpay-base'
import styles from './styles.module.scss'
import { setTxId, setTxStatusLoading } from '../../../../../src/app/actions'
import controller from '../../../../../src/hooks/isController'
import { Donate } from '../../../../index'
import { $donation, updateDonation } from '../../../../../src/store/donation'
import { RootState } from '../../../../../src/app/reducers'
import { useTranslation } from 'next-i18next'
import { $resolvedInfo } from '../../../../../src/store/resolvedInfo'

function Component() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const refInput = useRef(null)
    const resolvedInfo = useStore($resolvedInfo)
    const net = useSelector((state: RootState) => state.modal.net)
    const { isController } = controller()
    const donation = useStore($donation)

    const [menu, setMenu] = useState('')
    const [input, setInput] = useState('')

    function handleFocus() {
        if (refInput !== null && refInput.current !== null) {
            const si = refInput.current as any
            si.focus()
        }
    }

    useEffect(() => {
        isController()
        handleFocus()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const submitUpdate = async () => {
        if (resolvedInfo !== null && donation !== null) {
            try {
                const zilpay = new ZilPayBase()

                const tyron_ = await tyron.Donation.default.tyron(donation)

                let params = Array()
                let transition: string
                switch (menu) {
                    case 'username':
                        transition = 'UpdateUsername'
                        const username_ = {
                            vname: 'username',
                            type: 'String',
                            value: input,
                        }
                        params.push(username_)
                        break
                    case 'deadline':
                        transition = 'UpdateDeadline'
                        const val_ = {
                            vname: 'val',
                            type: 'Uint128',
                            value: input,
                        }
                        params.push(val_)
                        break
                    default:
                        transition = 'UpdateController'
                        const addr_ = {
                            vname: 'addr',
                            type: 'ByStr20',
                            value: input,
                        }
                        params.push(addr_)
                        break
                }

                const tyron__ = {
                    vname: 'tyron',
                    type: 'Option Uint128',
                    value: tyron_,
                }
                params.push(tyron__)

                dispatch(setTxStatusLoading('true'))
                updateModalTxMinimized(false)
                updateModalTx(true)
                let tx = await tyron.Init.default.transaction(net)
                await zilpay
                    .call({
                        contractAddress: resolvedInfo?.addr!,
                        transition: transition,
                        params: params as unknown as Record<string, unknown>[],
                        amount: String(donation),
                    })
                    .then(async (res) => {
                        dispatch(setTxId(res.ID))
                        dispatch(setTxStatusLoading('submitted'))
                        tx = await tx.confirm(res.ID)
                        if (tx.isConfirmed()) {
                            dispatch(setTxStatusLoading('confirmed'))
                            window.open(
                                `https://v2.viewblock.io/zilliqa/tx/${res.ID}?network=${net}&tab=state`
                            )
                        } else if (tx.isRejected()) {
                            dispatch(setTxStatusLoading('failed'))
                            setTimeout(() => {
                                toast.error(t('Transaction failed.'), {
                                    position: 'top-right',
                                    autoClose: 3000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: 'dark',
                                })
                            }, 1000)
                        }
                    })
            } catch (error) {
                dispatch(setTxStatusLoading('rejected'))
                updateModalTxMinimized(false)
                updateModalTx(true)
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
                toastId: 13,
            })
        }
        updateDonation(null)
    }

    const handleInput = (event: { target: { value: any; name: any } }) => {
        setInput('')
        updateDonation(null)

        let input = event.target.value

        if (menu === 'controller') {
            const addr = tyron.Address.default.verification(input)
            if (addr !== '') {
                setInput(addr)
            } else {
                toast.error(t('Wrong address.'), {
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: 'dark',
                    toastId: 5,
                })
            }
        } else if (menu === 'username') {
            setInput(input)
        } else if (menu === 'deadline') {
            input = Number(input)
            if (isNaN(input)) {
                toast.error(t('The input is not a number.'), {
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
                setInput(String(input))
            }
        }
    }

    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
            }}
        >
            {menu === '' && (
                <>
                    <h2>
                        <div
                            onClick={() => setMenu('controller')}
                            className={styles.flipCard}
                        >
                            <div className={styles.flipCardInner}>
                                <div className={styles.flipCardFront}>
                                    <p className={styles.cardTitle3}>
                                        {t('CONTROLLER')}
                                    </p>
                                </div>
                                <div className={styles.flipCardBack}>
                                    <p className={styles.cardTitle2}>
                                        {t(
                                            'CHANGE THE ADDRESS OF THE DID CONTROLLER'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </h2>
                    {/* <h2>
                        <div
                            onClick={() => setMenu('username')}
                            className={styles.flipCard}
                        >
                            <div className={styles.flipCardInner}>
                                <div className={styles.flipCardFront}>
                                    <p className={styles.cardTitle3}>
                                        {t('USERNAME')}
                                    </p>
                                </div>
                                <div className={styles.flipCardBack}>
                                    <p className={styles.cardTitle2}>
                                        {t(
                                            'UPDATE THE PUBLIC NAME OF YOUR SSI'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </h2>
                    <h2>
                        <div
                            onClick={() => setMenu('deadline')}
                            className={styles.flipCard}
                        >
                            <div className={styles.flipCardInner}>
                                <div className={styles.flipCardFront}>
                                    <p className={styles.cardTitle3}>
                                        {t('DEADLINE')}
                                    </p>
                                </div>
                                <div className={styles.flipCardBack}>
                                    <p className={styles.cardTitle2}>
                                        {t(
                                            'UPDATE THE MAXIMUM AMOUNT OF BLOCKS THAT YOUR SSI IS WILLING TO WAIT FOR A TRANSACTION TO GET CONFIRMED'
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </h2> */}
                </>
            )}
            {menu !== '' && (
                <button
                    onClick={() => {
                        setMenu('')
                        setInput('')
                    }}
                    style={{ marginBottom: '10%' }}
                    className="button"
                >
                    <span>{t('BACk')}</span>
                </button>
            )}
            {menu === 'controller' && (
                <>
                    <h3>{t('UPDATE DID CONTROLLER')}</h3>
                    <p>{t('New DID Controller address:')}</p>
                    <div style={{ display: 'flex' }}>
                        <input
                            ref={refInput}
                            name="controller"
                            style={{
                                width: '100%',
                                marginLeft: '2%',
                                marginRight: '2%',
                                marginTop: '14%',
                            }}
                            type="text"
                            onChange={handleInput}
                            placeholder="Type address"
                            autoFocus
                        />
                    </div>
                    {input !== '' && <Donate />}
                    {input !== '' && donation !== null && (
                        <div onClick={submitUpdate} className="actionBtn">
                            <span>{t('UPDATE DID CONTROLLER')}</span>
                        </div>
                    )}
                </>
            )}
            {menu === 'username' && (
                <>
                    <h3>{t('UPDATE SSI USERNAME')}</h3>
                    <p>
                        {t(
                            'This username is a public name that other dApps can use to verify data about your SSI.'
                        )}
                    </p>
                    <p>
                        {t(
                            'Only the owner of the NFT Username is allowed to confirm this update by calling the Accept Pending Username transaction.'
                        )}
                    </p>
                    <div style={{ display: 'flex' }}>
                        <input
                            ref={refInput}
                            name="username"
                            style={{
                                width: '100%',
                                marginLeft: '2%',
                                marginRight: '2%',
                                marginTop: '14%',
                            }}
                            type="text"
                            onChange={handleInput}
                            placeholder="Type username"
                            autoFocus
                        />
                    </div>
                    {input !== '' && <Donate />}
                    {input !== '' && donation !== null && (
                        <div onClick={submitUpdate} className="actionBtn">
                            <span>{t('UPDATE SSI USERNAME')}</span>
                        </div>
                    )}
                </>
            )}
            {menu === 'deadline' && (
                <>
                    <h3>{t('UPDATE DEADLINE')}</h3>
                    <p>
                        {t(
                            'The deadline is the number of blocks you are willing to wait for a transaction to get processed on the blockchain (each block is approximately 2min).'
                        )}
                    </p>
                    <h4>{t('TYPE THE NUMBER OF BLOCKS:')}</h4>
                    <div style={{ display: 'flex' }}>
                        <input
                            ref={refInput}
                            name="deadline"
                            style={{
                                width: '100%',
                                marginLeft: '2%',
                                marginRight: '2%',
                                marginTop: '14%',
                            }}
                            type="text"
                            onChange={handleInput}
                            placeholder="Type number"
                            autoFocus
                        />
                    </div>
                    {input !== '' && input !== '0' && <Donate />}
                    {input !== '' && input !== '0' && donation !== null && (
                        <div onClick={submitUpdate} className="actionBtn">
                            <span>{t('UPDATE DEADLINE')}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Component
