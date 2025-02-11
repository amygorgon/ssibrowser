import Layout from '../../components/Layout'
import { Headline, Services } from '../../components'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import styles from '../styles.module.scss'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'
import { RootState } from '../../src/app/reducers'
import { updateModalNewSsi } from '../../src/store/modal'

function Address() {
    const { t } = useTranslation()
    const net = useSelector((state: RootState) => state.modal.net)
    const loginInfo = useSelector((state: RootState) => state.modal)

    const data = [
        {
            name: 'DidDomains',
            router: '',
        },
    ]

    return (
        <Layout>
            <div className={styles.headlineWrapper}>
                <Headline data={data} />
                {loginInfo.address !== null && (
                    <div
                        style={{
                            marginBottom: '10%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <div style={{ marginBottom: '4%' }}>
                            <p className={styles.headerSubTitle}>
                                {t('YOUR_W3C_DID')}
                            </p>
                            <a
                                className={styles.address}
                                href={`https://v2.viewblock.io/zilliqa/address/${loginInfo.address}?network=${net}&tab=state`}
                                rel="noreferrer"
                                target="_blank"
                            >
                                did:tyron:zil...{loginInfo.address.slice(-10)}
                            </a>
                        </div>
                        <div
                            onClick={() => updateModalNewSsi(true)}
                            className="actionBtn"
                        >
                            {t('BUY NFT USERNAME')}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
})

export default Address
