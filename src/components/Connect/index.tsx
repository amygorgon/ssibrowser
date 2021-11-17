import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import styles from './styles.module.scss';
import { showSignInModal } from 'src/app/actions';
import { ConnectModal } from 'src/components';

const mapDispatchToProps = {
    dispatchShowModal: showSignInModal
};

const connector = connect(undefined, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

function SignIn(props: Props) {
    const { dispatchShowModal } = props;

    const handleOnClick = () => {
        dispatchShowModal();
    };

    return (
        <>
            <ConnectModal />
            <button className={styles.buttonSignIn} onClick={handleOnClick}>
                Connect
            </button>
        </>
    );
}

export default connector(SignIn);
