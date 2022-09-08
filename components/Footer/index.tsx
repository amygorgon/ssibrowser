import stylesDark from '../../styles/css/Footer.module.css'
import stylesLight from '../../styles/css/FooterLight.module.css'
import Image from 'next/image'
import TyronLogo from '../../src/assets/logos/tyron_logo.png'
import upDown from '../../src/assets/icons/up_down_arrow.svg'
import { useState } from 'react'
import { RootState } from '../../src/app/reducers'
import { useDispatch, useSelector } from 'react-redux'
import { UpdateLang } from '../../src/app/actions'
import { $resolvedInfo } from '../../src/store/resolvedInfo'
import { useStore } from 'effector-react'
import { $menuOn } from '../../src/store/menuOn'
import {
    $modalAddFunds,
    $modalBuyNft,
    $modalDashboard,
    $modalGetStarted,
    $modalInvestor,
    $modalNewMotions,
    $modalNewSsi,
    $modalWithdrawal,
} from '../../src/store/modal'

function Footer() {
    const dispatch = useDispatch()
    const language = useSelector((state: RootState) => state.modal.lang)
    const isLight = useSelector((state: RootState) => state.modal.isLight)
    const styles = isLight ? stylesLight : stylesDark
    const resolvedInfo = useStore($resolvedInfo)
    const menuOn = useStore($menuOn)
    const modalDashboard = useStore($modalDashboard)
    const modalNewSsi = useStore($modalNewSsi)
    const modalGetStarted = useStore($modalGetStarted)
    const modalBuyNft = useStore($modalBuyNft)
    const modalAddFunds = useStore($modalAddFunds)
    const modalWithdrawal = useStore($modalWithdrawal)
    const modalNewMotions = useStore($modalNewMotions)
    const modalInvestor = useStore($modalInvestor)

    const [showDropdown, setShowDropdown] = useState(false)

    const changeLang = (val: string) => {
        setShowDropdown(false)
        dispatch(UpdateLang(val))
    }

    const langDropdown = [
        {
            key: 'en',
            name: '🇬🇧 English',
        },
        {
            key: 'es',
            name: '🇪🇸 Spanish',
        },
        {
            key: 'cn',
            name: '🇨🇳 Chinese',
        },
        {
            key: 'id',
            name: '🇮🇩 Indonesian',
        },
        {
            key: 'ru',
            name: '🇷🇺 Russian',
        },
    ]

    if (
        menuOn ||
        modalDashboard ||
        modalNewSsi ||
        modalGetStarted ||
        modalBuyNft ||
        modalAddFunds ||
        modalWithdrawal ||
        modalNewMotions ||
        modalInvestor
    ) {
        return <div className={styles.footer} />
    }

    return (
        <footer className={styles.footer}>
            {showDropdown && (
                <div
                    className={styles.closeWrapper}
                    onClick={() => setShowDropdown(false)}
                />
            )}
            <div className={styles.languageSelectorWrapper}>
                <div className={styles.dropdownCheckListWrapper}>
                    {showDropdown && (
                        <>
                            <div className={styles.wrapperOption}>
                                {langDropdown.map((val, i) => (
                                    <div
                                        onClick={() => changeLang(val.key)}
                                        key={i}
                                        className={styles.option}
                                    >
                                        <div>
                                            {val.name}{' '}
                                            {val.key === language ? (
                                                <span>&#10004;</span>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                    <div
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={styles.dropdownCheckList}
                    >
                        {
                            langDropdown.filter(
                                (val_) => val_.key === language
                            )[0]?.name
                        }
                        <Image
                            width={15}
                            height={10}
                            src={upDown}
                            alt="arrow"
                        />
                    </div>
                </div>
            </div>
            <div
                onClick={() => {
                    console.log(resolvedInfo)
                    // @info why the router here does not work? URL update but UI not: because when we're pushing to the
                    // same page e.g /ilhamb to /ssiprotocol it'll not trigger useeffect (but if from ilhamb/didx to /ssiprotocol this is works)
                    // Router.push('/ssiprotocol/tree')
                    window.open('http://tyron.network/ssiprotocol', '_self')
                }}
                className={styles.tyronLg}
            >
                <Image src={TyronLogo} alt="tyron-logo" />
            </div>
        </footer>
    )
}

export default Footer
