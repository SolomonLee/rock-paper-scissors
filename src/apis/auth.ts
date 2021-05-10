import firebase from "firebase/app";
import { resultError, resultOk, Result } from "./result";
import "firebase/auth";

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
    console.log(`signIn email:${email}, password:${password}`);
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

export const signOut = async (): Promise<Result> => {
    try {
        await firebase.auth().signOut();

        return resultOk();
    } catch (e) {
        console.log(`signIn error!! ${e}`);
    }

    return resultError("登入失敗");
};

console.log(`#1 AUTH`);
type AuthCallBack = (user: firebase.User | null) => void;
const mapCallBack = new Map<string, AuthCallBack>();
setTimeout(() => {
    console.log(`#2 AUTH`);

    firebase.auth().onAuthStateChanged((user) => {
        console.log("firebase.auth onAuthStateChanged");
        mapCallBack.forEach((cb) => {
            cb(user);
        });
    });
}, 2000);

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
