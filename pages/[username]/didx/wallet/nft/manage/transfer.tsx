import Layout from '../../../../../../components/Layout'
import { Headline, TransferNFTUsername } from '../../../../../../components'
import styles from '../../../../../styles.module.scss'
import { GetStaticPaths } from 'next/types'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

function Header() {
    const data = [
        {
            name: 'wallet',
            route: '/didx/wallet',
        },
        {
            name: 'nft operations',
            route: '/didx/wallet/nft',
        },
        {
            name: 'manage nft',
            route: '/didx/wallet/nft/manage',
        },
    ]

    return (
        <>
            <Layout>
                <div className={styles.headlineWrapper}>
                    <Headline data={data} />
                </div>
                <TransferNFTUsername />
            </Layout>
        </>
    )
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
    return {
        paths: [],
        fallback: 'blocking',
    }
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
})

export default Header
