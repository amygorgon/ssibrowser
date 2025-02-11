import React, { useState } from 'react'
import { useStore } from 'effector-react'
import * as tyron from 'tyron'
import { toast } from 'react-toastify'
import { Lock, SocialRecover, Sign, Spinner } from '../../..'
import styles from './styles.module.scss'
import { $doc } from '../../../../src/store/did-doc'
import { $resolvedInfo } from '../../../../src/store/resolvedInfo'
import { $loadingDoc } from '../../../../src/store/loading'
import { useTranslation } from 'next-i18next'
import { $arconnect } from '../../../../src/store/arconnect'

function Component() {
    const { t } = useTranslation()
    const doc = useStore($doc)
    const resolvedInfo = useStore($resolvedInfo)
    const username = resolvedInfo?.name
    const arConnect = useStore($arconnect)
    const loadingDoc = useStore($loadingDoc)

    const [hideRecovery, setHideRecovery] = useState(true)
    const [recoveryLegend, setRecoveryLegend] = useState('SOCIAL RECOVER')

    const [hideLock, setHideLock] = useState(true)
    const [lockLegend, setLockLegend] = useState('LOCK')

    const [hideSig, setHideSig] = useState(true)
    const [sigLegend, setSigLegend] = useState('SIGN ADDRESS')

    const is_operational =
        resolvedInfo?.status !== tyron.Sidetree.DIDStatus.Deactivated &&
        resolvedInfo?.status !== tyron.Sidetree.DIDStatus.Locked

    const spinner = <Spinner />

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
            }}
        >
            {loadingDoc ? (
                spinner
            ) : (
                <>
                    {doc?.guardians.length === 0 && hideSig && hideLock && (
                        <p>
                            {t(
                                'Social Recovery has not been enabled by X yet.',
                                { name: username }
                            )}
                        </p>
                    )}
                    <ul>
                        <li>
                            {doc?.guardians.length !== 0 &&
                                hideLock &&
                                hideSig &&
                                hideRecovery && (
                                    <>
                                        <h4>
                                            {t('X HAS X GUARDIANS', {
                                                name: username,
                                                value: doc?.guardians.length,
                                            })}
                                        </h4>
                                        <button
                                            type="button"
                                            className={styles.button}
                                            onClick={() => {
                                                setHideRecovery(false)
                                                setRecoveryLegend('back')
                                            }}
                                        >
                                            <p
                                                className={
                                                    styles.buttonColorText
                                                }
                                            >
                                                {t(recoveryLegend)}
                                            </p>
                                        </button>
                                    </>
                                )}
                            {!hideRecovery && (
                                <div>
                                    <SocialRecover />
                                </div>
                            )}
                        </li>
                        <li>
                            {hideRecovery && hideLock && hideSig && (
                                <div style={{ marginTop: '20%' }}>
                                    <button
                                        type="button"
                                        className={styles.button}
                                        onClick={() => {
                                            if (arConnect === null) {
                                                toast.warning(
                                                    'Connect with ArConnect.',
                                                    {
                                                        position: 'top-center',
                                                        autoClose: 2000,
                                                        hideProgressBar: false,
                                                        closeOnClick: true,
                                                        pauseOnHover: true,
                                                        draggable: true,
                                                        progress: undefined,
                                                        theme: 'dark',
                                                    }
                                                )
                                            } else {
                                                setHideSig(false)
                                                setSigLegend('back')
                                            }
                                        }}
                                    >
                                        <p className={styles.buttonText}>
                                            {t(sigLegend)}
                                        </p>
                                    </button>
                                </div>
                            )}
                            {!hideSig && <Sign />}
                        </li>
                        <li>
                            {is_operational &&
                                resolvedInfo?.status !==
                                    tyron.Sidetree.DIDStatus.Deployed &&
                                hideRecovery &&
                                hideSig &&
                                hideLock && (
                                    <p>
                                        <h5
                                            style={{
                                                color: 'red',
                                                marginTop: '20%',
                                            }}
                                        >
                                            {t('DANGER ZONE')}
                                        </h5>
                                        <button
                                            type="button"
                                            className={styles.button}
                                            onClick={() => {
                                                if (arConnect === null) {
                                                    toast.warning(
                                                        'Connect with ArConnect.',
                                                        {
                                                            position:
                                                                'top-center',
                                                            autoClose: 2000,
                                                            hideProgressBar:
                                                                false,
                                                            closeOnClick: true,
                                                            pauseOnHover: true,
                                                            draggable: true,
                                                            progress: undefined,
                                                            theme: 'dark',
                                                        }
                                                    )
                                                } else {
                                                    setHideLock(false)
                                                    setLockLegend('back')
                                                }
                                            }}
                                        >
                                            <p
                                                className={
                                                    styles.buttonColorDText
                                                }
                                            >
                                                {t(lockLegend)}
                                            </p>
                                        </button>
                                    </p>
                                )}
                            {!hideLock && (
                                <div>
                                    <Lock />
                                </div>
                            )}
                        </li>
                    </ul>
                </>
            )}
        </div>
    )
}

export default Component
