import React, { useState, useRef, useEffect } from 'react'
import * as tyron from 'tyron'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import styles from './styles.module.scss'
import { useStore } from 'effector-react'
import { updateOriginatorAddress } from '../../../../src/store/originatorAddress'
import { RootState } from '../../../../src/app/reducers'
import { useTranslation } from 'next-i18next'
import { $resolvedInfo } from '../../../../src/store/resolvedInfo'
import { SearchBarWallet, Selector } from '../../..'
function Component({ type }) {
    const zcrypto = tyron.Util.default.Zcrypto()
    const { t } = useTranslation()
    const searchInput = useRef(null)
    function handleFocus() {
        if (searchInput !== null && searchInput.current !== null) {
            const si = searchInput.current as any
            si.focus()
        }
    }
    useEffect(() => {
        // current property is refered to input element
        handleFocus()
    }, [])

    const zilAddr = useSelector((state: RootState) => state.modal.zilAddr)
    const net = useSelector((state: RootState) => state.modal.net)
    const resolvedInfo = useStore($resolvedInfo)
    const username = resolvedInfo?.name
    const domain = resolvedInfo?.domain

    const [loading, setLoading] = useState(false)

    const [originator, setOriginator] = useState('')
    const [input, setInput] = useState('')
    const [legend, setLegend] = useState('Save')

    const handleOnChange = (value: any) => {
        updateOriginatorAddress(null)
        setOriginator('')
        setLegend('save')
        const login_ = value

        if (zilAddr === null) {
            toast.error('To continue, log in.', {
                position: 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'dark',
            })
        } else {
            if (login_ === 'zilliqa') {
                updateOriginatorAddress({
                    value: 'zilliqa',
                })
            }
            setOriginator(login_)
        }
    }

    const handleInput = ({
        currentTarget: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
        setLegend('save')
        updateOriginatorAddress(null)
        setInput(value.toLowerCase())
    }

    const resolveUsername = async () => {
        const username_ = input.split('@')[0]
        let domain_ = ''
        if (input.includes('@')) {
            domain_ = input.split('@')[1].replace('.did', '')
        }
        if (
            username_ === username &&
            domain_ === domain &&
            type === 'AddFundsStake'
        ) {
            toast.error('The recipient and sender must be different.', {
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
        } else {
            setLoading(true)
            await tyron.SearchBarUtil.default
                .fetchAddr(net, username_, domain_)
                .then(async (addr) => {
                    addr = zcrypto.toChecksumAddress(addr!)
                    let init = new tyron.ZilliqaInit.default(
                        tyron.DidScheme.NetworkNamespace.Mainnet
                    )
                    switch (net) {
                        case 'testnet':
                            init = new tyron.ZilliqaInit.default(
                                tyron.DidScheme.NetworkNamespace.Testnet
                            )
                    }
                    let did_addr: string
                    if (domain === 'did') {
                        did_addr = addr
                    } else {
                        did_addr = await tyron.SearchBarUtil.default.fetchAddr(
                            net,
                            username_,
                            'did'
                        )
                    }
                    const state =
                        await init.API.blockchain.getSmartContractState(
                            did_addr
                        )
                    const did_controller = zcrypto.toChecksumAddress(
                        state.result.controller
                    )
                    if (did_controller !== zilAddr?.base16) {
                        throw Error(t('Failed DID Controller authentication.'))
                    } else {
                        // if (domain_ === 'stake') {
                        //     const addr_ =
                        //         await tyron.SearchBarUtil.default.fetchAddr(
                        //             net,
                        //             username_,
                        //             'zil'
                        //         )
                        //     if (addr_ === resolvedInfo?.addr) {
                        //         toast.error(
                        //             'Sender and recipient should be different',
                        //             {
                        //                 position: 'top-right',
                        //                 autoClose: 2000,
                        //                 hideProgressBar: false,
                        //                 closeOnClick: true,
                        //                 pauseOnHover: true,
                        //                 draggable: true,
                        //                 progress: undefined,
                        //                 theme: 'dark',
                        //             }
                        //         )
                        //     } else {
                        //         updateOriginatorAddress({
                        //             username: username_,
                        //             value: addr_,
                        //         })
                        //         setLegend('saved')
                        //     }
                        // } else {
                        updateOriginatorAddress({
                            value: addr,
                            username: username_,
                            domain: domain_,
                        })
                        setLegend('saved')
                        // }
                    }
                })
                .catch(() => {
                    toast.error('Invalid username', {
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: 'dark',
                    })
                })

            setLoading(false)
        }
    }

    const optionOriginator = [
        {
            key: '',
            name: t('Wallet'),
        },
        {
            key: 'ssi',
            name: 'TYRON',
        },
        {
            key: 'zilliqa',
            name: 'Zilliqa',
        },
    ]

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
            }}
        >
            {zilAddr !== null && (
                <>
                    <div>Select source:</div>
                    <div className={styles.container}>
                        <Selector
                            option={optionOriginator}
                            onChange={handleOnChange}
                            value={originator}
                        />
                    </div>
                </>
            )}
            {originator === 'ssi' && (
                <SearchBarWallet
                    resolveUsername={resolveUsername}
                    handleInput={handleInput}
                    input={input}
                    loading={loading}
                    saved={legend === 'saved'}
                />
            )}
        </div>
    )
}

export default Component
