import { useStore } from 'effector-react';
import React, { useState } from 'react';
import { $user } from 'src/store/user';
import styles from './styles.module.scss';

function Component() {
    const user = useStore($user);
    const [hideDid, setHideDid] = useState(true);
    const [didLegend, setDidLegend] = useState('did');

    const [hideRecovery, setHideRecovery] = useState(true);
    const [recoveryLegend, setRecoveryLegend] = useState('recovery');

    const [hideDns, setHideDns] = useState(true);
    const [dnsLegend, setDnsLegend] = useState('dns');

    const [hideTrade, setHideTrade] = useState(true);
    const [tradeLegend, setTradeLegend] = useState('trade');
    
    const [hideStake, setHideStake] = useState(true);
    const [stakeLegend, setStakeLegend] = useState('stake');

    const [hideOrder, setHideOrder] = useState(true);
    const [orderLegend, setOrderLegend] = useState('order');
    
    const [hidePSC, setHidePSC] = useState(true);
    const [pscLegend, setPSCLegend] = useState('join');
    
    return (
        <div className={ styles.container }>
            <h2 style={{ textAlign: 'center', color: 'yellow' }}>
                SSI Wallet{' '}
                <span style={{ textTransform: 'lowercase', color: 'white' }}>
                    of
                </span>{' '}
                <span className={ styles.username }>
                    {user?.nft}.{user?.domain}
                </span>
            </h2>
            {   
                hideTrade && hideStake && hideOrder && hidePSC &&
                <div style={{ marginTop: '6%', width: '110%' }}>
                    <h3>
                        Decentralized identity
                        {
                            hideDid
                            ?   <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideDid(false);
                                        setDidLegend('off');
                                    }}
                                >
                                    <p className={styles.buttonWhiteText}>
                                        {didLegend}
                                    </p>
                                </button>
                            :   <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideDid(true);
                                        setDidLegend('did');
                                    }}
                                >
                                    <p className={styles.buttonText}>
                                        {didLegend}
                                    </p>
                                </button>
                        }
                        {
                            hideRecovery
                            ?   <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideRecovery(false);
                                        setRecoveryLegend('off');
                                    }}
                                >
                                    <p className={styles.buttonWhiteText}>
                                        {recoveryLegend}
                                    </p>
                                </button>
                            :    <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideRecovery(true);
                                        setRecoveryLegend('recovery');
                                    }}
                                >
                                    <p className={styles.buttonText}>
                                        {recoveryLegend}
                                    </p>
                                </button>
                        }
                        {
                            hideDns
                            ?   <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideDns(false);
                                        setDnsLegend('off');
                                    }}
                                >
                                    <p className={styles.buttonWhiteText}>
                                        {dnsLegend}
                                    </p>
                                </button>
                            :    <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideDns(true);
                                        setDnsLegend('dns');
                                    }}
                                >
                                    <p className={styles.buttonText}>
                                        {dnsLegend}
                                    </p>
                                </button>
                        }
                    </h3>
                    {
                        !hideDid &&
                            <>
                                <div style={{ marginTop: '7%' }}>
                                    <p>Coming soon.</p>
                                </div>
                            </>
                    }
                    {
                        !hideRecovery &&
                            <>
                                <div style={{ marginTop: '7%' }}>
                                    <p>Coming soon.</p>
                                </div>
                            </>
                    }
                    {
                        !hideDns &&
                            <>
                                <div style={{ marginTop: '7%' }}>
                                    <p>Coming soon.</p>
                                </div>
                            </>
                    }
                </div>
            }
            {
                hideOrder && hidePSC &&
                <div style={{ marginTop: '6%' }}>
                    <h3>
                        Decentralized finance
                        {
                            hideTrade
                            ?   <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideTrade(false);
                                        setTradeLegend('back');
                                    }}
                                >
                                    <p className={styles.buttonColorText}>
                                        {tradeLegend}
                                    </p>
                                </button>
                            :    <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideTrade(true);
                                        setTradeLegend('trade');
                                    }}
                                >
                                    <p className={styles.buttonText}>
                                        {tradeLegend}
                                    </p>
                                </button>
                        }
                        {
                            hideStake
                            ?   <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideStake(false);
                                        setStakeLegend('back');
                                    }}
                                >
                                    <p className={styles.buttonColorText}>
                                        {stakeLegend}
                                    </p>
                                </button>
                            :    <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideStake(true);
                                        setStakeLegend('stake');
                                    }}
                                >
                                    <p className={styles.buttonText}>
                                        {stakeLegend}
                                    </p>
                                </button>
                        }
                    </h3>
                    {
                        !hideTrade &&
                            <div style={{ marginTop: '7%' }}>
                                <p>Coming soon.</p>
                            </div>
                    }
                    {
                        !hideStake &&
                            <div style={{ marginTop: '7%' }}>
                                <p>Coming soon.</p>
                            </div>
                    }
                </div>
            }
            {
                hideTrade && hideStake && hidePSC &&
                <div style={{ marginTop: '6%' }}>
                    <h3>
                        Meta-transactions
                        {
                            hideOrder
                            ?   <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideOrder(false);
                                        setOrderLegend('back');
                                    }}
                                >
                                    <p className={styles.buttonWhiteText}>
                                        {orderLegend}
                                    </p>
                                </button>
                            :    <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHideOrder(true);
                                        setOrderLegend('order');
                                    }}
                                >
                                    <p className={styles.buttonText}>
                                        {orderLegend}
                                    </p>
                                </button>
                        }
                    </h3>
                    {
                        !hideOrder &&
                            <div style={{ marginTop: '7%' }}>
                                <p>Coming soon.</p>
                            </div>
                    }
                </div>
            }
            {
                hideTrade && hideStake && hideOrder &&
                <div style={{ marginTop: '6%' }}>
                    <h3>
                        SSI Staking Program
                        {
                            hidePSC
                            ?   <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHidePSC(false);
                                        setPSCLegend('back');
                                    }}
                                >
                                    <p className={styles.buttonColorText}>
                                        {pscLegend}
                                    </p>
                                </button>
                            :    <button
                                    type="button"
                                    className={styles.button}
                                    onClick={() => {
                                        setHidePSC(true);
                                        setPSCLegend('join');
                                    }}
                                >
                                    <p className={styles.buttonText}>
                                        {pscLegend}
                                    </p>
                                </button>
                        }
                    </h3>
                    {
                        !hidePSC &&
                            <div style={{ marginTop: '7%' }}>
                                <p>Coming soon.</p>
                            </div>
                    }
                </div>
            }
        </div>
    );
}

export default Component
