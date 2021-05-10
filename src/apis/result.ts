export interface Result {
    datas: any;
    result: boolean;
    resultMsg: string;
}

const finalResult = (datas: unknown, result: boolean, resultMsg: string) =>
    <Result>{ datas, result, resultMsg };

export const resultOk = (datas: unknown = {}, resultMsg = ""): Result =>
    finalResult(datas, true, resultMsg);

export const resultError = (resultMsg: string, datas: unknown = {}): Result =>
    finalResult(datas, false, resultMsg);
