import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styles from './styles.module.scss';
import { showNewWalletModal } from 'src/app/actions';
import { NewWalletModal } from 'src/components';

const mapDispatchToProps = {
    dispatchShowModal: showNewWalletModal
};

const connector = connect(undefined, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

function NewWallet(props: Props) {
    const { dispatchShowModal } = props;

    const handleOnClick = () => {
        dispatchShowModal();
    };

    return (
        <>
            <button className={styles.button} onClick={handleOnClick}>
                create ssi account
            </button>
            <NewWalletModal />
        </>
    );
}

export default connector(NewWallet);
