import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/auth";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AuthResult {}

export const signIn = async (
    email: string,
    password: string
): Promise<Result<AuthResult>> => {
    try {
        const result = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
        if (result.user) return resultOk();
    } catch (e) {
        console.log(`signIn error!! ${e}`);
    }

    return resultError("登入失敗");
};

export const signOut = async (): Promise<Result<AuthResult>> => {
    try {
        await firebase.auth().signOut();

        return resultOk();
    } catch (e) {
        console.log(`signIn error!! ${e}`);
    }

    return resultError("登入失敗");
};

type AuthCallBack = (user: firebase.User | null) => void;
const mapCallBack = new Map<string, AuthCallBack>();
setTimeout(() => {
    firebase.auth().onAuthStateChanged((user) => {
        mapCallBack.forEach((cb) => {
            cb(user);
        });
    });
});

export const register = async (
    email: string,
    password: string
): Promise<Result<AuthResult>> => {
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        setTimeout(() => signIn(email, password), 2000);

        return resultOk({});
    } catch (e) {
        console.log(`register error!! ${e}`);
    }

    return resultError("註冊失敗");
};

export const addAuthStateChangedCallBack = (
    key: string,
    cb: AuthCallBack
): void => {
    mapCallBack.set(key, cb);
};

export const removeAuthStateChangedCallBack = (key: string): void => {
    mapCallBack.delete(key);
};
