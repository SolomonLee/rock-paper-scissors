import React, { MouseEvent, useEffect, useLayoutEffect, useState } from "react";
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

const User = (): JSX.Element => {
    const gamerEmail = useSelector(selectGamerEmail);
    const gamerName = useSelector(selectGamerName);
    const inSignIn = useSelector(selectGamerInSignIn);
    const signInErrorMsg = useSelector(selectGamerSignInErrorMsg);

    const dispatch = useDispatch();

    // errorMsg={errorMsg}

    const [isOpenSing, setIsOpenSing] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            dispatch(getGamerInfoAsync(false));
        }, 500);
    }, []);

    useEffect(() => {
        console.log(`gamerEmail: ${gamerEmail}`);
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
        console.log("handleShowSignInModal");
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

    return (
        <div className="user">
            {inSignIn ? (
                <span>
                    <span className="material-icons icons-loading" />
                    確認中...
                </span>
            ) : null}
            {gamerEmail?.length ? (
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
            ) : (
                <div className="functions">
                    <button
                        type="button"
                        className="btn btn_style1"
                        onClick={handleShowSignInModal}
                    >
                        sign in
                    </button>
                </div>
            )}
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
