import React, { useRef, useEffect } from 'react'
import Image from 'next/image'
import styles from './styles.module.scss'
import { useTranslation } from 'next-i18next'
import ContinueArrow from '../../../../src/assets/icons/continue_arrow.svg'
import TickIcoYellow from '../../../../src/assets/icons/tick.svg'
import TickIcoBlue from '../../../../src/assets/icons/tick_blue.svg'
import { Spinner } from '../../..'

function Component({ resolveUsername, handleInput, input, loading, saved }) {
    const isZil = window.location.pathname.includes('/zil')
    const TickIco = isZil ? TickIcoBlue : TickIcoYellow
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

    const spinner = <Spinner />

    const handleContinue = async () => {
        resolveUsername()
    }
    const handleOnKeyPress = ({
        key,
    }: React.KeyboardEvent<HTMLInputElement>) => {
        if (key === 'Enter') {
            handleContinue()
        }
    }

    return (
        <div style={{ width: '100%' }} className={styles.container2}>
            <div style={{ display: 'flex', width: '100%' }}>
                <input
                    ref={searchInput}
                    type="text"
                    style={{ width: '100%', marginRight: '5%' }}
                    onChange={handleInput}
                    onKeyPress={handleOnKeyPress}
                    placeholder={t('TYPE_USERNAME')}
                    value={input}
                    autoFocus
                />
            </div>
            <div className={styles.arrowWrapper}>
                <div
                    className={isZil ? 'continueBtnBlue' : 'continueBtn'}
                    onClick={() => {
                        handleContinue()
                    }}
                >
                    {loading ? (
                        spinner
                    ) : (
                        <Image
                            src={saved ? TickIco : ContinueArrow}
                            alt="arrow"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Component
