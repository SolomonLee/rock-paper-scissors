import React, { MouseEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    signOut,
    signInAsync,
    registerAsync,
    getGamerInfoAsync,
    selectGamerEmail,
    selectGamerName,
    selectGamerInSignIn,
    selectGamerSignInErrorMsg,
} from "../../reducers/gamerRedux";
import Modal from "../combo/modal/Modal";
import SignInForm from "../combo/form/signIn/SignInForm";
import { useAuthStateChanged } from "../../hooks/authHook";

const User = (): JSX.Element => {
    const gamerEmail = useSelector(selectGamerEmail);
    const gamerName = useSelector(selectGamerName);
    const inSignIn = useSelector(selectGamerInSignIn);
    const signInErrorMsg = useSelector(selectGamerSignInErrorMsg);

    const dispatch = useDispatch();

    const [isOpenSing, setIsOpenSing] = useState(false);
    useAuthStateChanged("autoGetGamerInfo", (user) => {
        if (user) dispatch(getGamerInfoAsync(false));
    });

    useEffect(() => {
        if (gamerEmail?.length) {
            setIsOpenSing(false);
        }
    }, [gamerEmail]);

    const handleSignOut = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        dispatch(signOut());
    };

    const handleShowSignInModal = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        dispatch(signOut());
        setIsOpenSing(true);
    };

    const handleSignIn = (email: string, password: string): void => {
        dispatch(signInAsync({ email, password }));
    };

    const handleRegister = (email: string, password: string) => {
        dispatch(registerAsync({ email, password }));
    };

    const handleSetCloseModal = () => {
        setIsOpenSing(false);
    };

    let showJSX = null;
    if (inSignIn) {
        showJSX = (
            <span>
                <span className="material-icons icons-loading" />
                確認中...
            </span>
        );
    } else if (gamerEmail?.length) {
        showJSX = (
            <>
                <div className="info">
                    <span className="email">{gamerEmail}</span>
                    <span className="name">Hi! {gamerName}</span>
                </div>
                <div className="functions">
                    <button
                        type="button"
                        className="btn btn_style1"
                        onClick={handleSignOut}
                    >
                        sign out
                    </button>
                </div>
            </>
        );
    } else {
        showJSX = (
            <div className="functions">
                <button
                    type="button"
                    className="btn btn_style1"
                    onClick={handleShowSignInModal}
                >
                    sign in
                </button>
            </div>
        );
    }

    return (
        <div className="user">
            {showJSX}
            <Modal
                isOpen={isOpenSing}
                stylenum={0}
                setClose={handleSetCloseModal}
            >
                <SignInForm
                    singInFunction={handleSignIn}
                    registerFunction={handleRegister}
                    isWaitingResult={inSignIn}
                    errorMsg={signInErrorMsg}
                />
            </Modal>
        </div>
    );
};

export default User;
