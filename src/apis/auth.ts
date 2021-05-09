import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";

export const register = async (
    email: string,
    password: string
): Promise<Result> => {
    console.log(`register email:${email}, password:${password}`);
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);

        return resultOk();
    } catch (e) {
        console.log(`register error!! ${e}`);
    }

    return resultError("註冊失敗");
};

export const signIn = async (
    email: string,
    password: string
): Promise<Result> => {
    console.log(`register email:${email}, password:${password}`);
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

type AuthCallBack = (user: firebase.User | null) => void;
const mapCallBack = new Map<string, AuthCallBack>();
firebase.auth().onAuthStateChanged((user) => {
    mapCallBack.forEach((cb) => {
        cb(user);
    });
});

export const addAuthStateChangedCallBack = (
    key: string,
    cb: AuthCallBack
): void => {
    console.log(`addAuthStateChangedCallBack key:${key}, cb:${cb}`);
    mapCallBack.set(key, cb);
};

export const removeAuthStateChangedCallBack = (key: string): void => {
    console.log(`removeAuthStateChangedCallBack key:${key}`);
    mapCallBack.delete(key);
};
