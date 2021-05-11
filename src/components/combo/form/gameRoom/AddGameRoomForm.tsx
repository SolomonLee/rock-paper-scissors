import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FillHandle } from "../../fillitem/FillInterface";
import FillSelectItem, { Option } from "../../fillitem/FillSelectItem";
import FillItem from "../../fillitem/FillItem";
import Split from "../../../elements/Split";
import { InsertGameRoomInfo } from "../../../../apis/gameRooms";
import { GameCondition } from "../../../../apis/gemeConditions";

const SignupSchema = Yup.object().shape({
    roomName: Yup.string()
        .min(7, "太短 7-20個單位")
        .max(20, "太長 7-20個單位")
        .required("必填欄位喔!"),
    gameConditionKey: Yup.string().required("必填欄位喔!"),
    gameConditionValue: Yup.number()
        .min(1, "不行再少了!")
        .max(10, "太多了啦!")
        .required("必填欄位喔!"),
    loserAward: Yup.string(),
    winnerAward: Yup.string(),
});

interface Props {
    addGameRoomFunction: (gc: InsertGameRoomInfo) => void;
    errorMsg: string;
    isWaitingResult: boolean;
    gameConditions: GameCondition[];
}

const AddGameRoomForm = ({
    addGameRoomFunction,
    isWaitingResult,
    errorMsg = "",
    gameConditions,
}: Props): JSX.Element => {
    const refRoomName = useRef<FillHandle>(null);
    const refWinnerAward = useRef<FillHandle>(null);
    const refLoserAward = useRef<FillHandle>(null);
    const refGameConditionKey = useRef<FillHandle>(null);
    const refGameConditionValue = useRef<FillHandle>(null);

    useEffect(() => {
        if (isWaitingResult) {
            refRoomName.current?.disabled();
            refWinnerAward.current?.disabled();
            refLoserAward.current?.disabled();
            refGameConditionKey.current?.disabled();
            refGameConditionValue.current?.disabled();
        } else {
            refRoomName.current?.undisabled();
            refWinnerAward.current?.undisabled();
            refLoserAward.current?.undisabled();
            refGameConditionKey.current?.undisabled();
            refGameConditionValue.current?.undisabled();
        }
    }, [isWaitingResult]);

    const options = gameConditions.map(
        (gameCondition): Option => ({
            value: gameCondition.conditionId,
            title: `${gameCondition.name}: ${gameCondition.description}`,
        })
    );

    const handleSubmit = (gc: InsertGameRoomInfo): void => {
        if (isWaitingResult) return;
        addGameRoomFunction(gc);
    };

    const formik = useFormik({
        initialValues: {
            roomName: "",
            gameConditionKey: options?.[0]?.value || "",
            gameConditionValue: 1,
            loserAward: "",
            winnerAward: "",
        },
        validationSchema: SignupSchema,
        onSubmit: (values: InsertGameRoomInfo, { resetForm }) => {
            handleSubmit(values);
            resetForm();
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="form_box">
            <div className="box_title">建立新房間</div>
            <div className="box_content">
                <div className="row">
                    <div className="col-12">
                        <FillItem
                            ref={refRoomName}
                            name="roomName"
                            title="房名"
                            type="text"
                            value={formik.values.roomName}
                            onchange={formik.handleChange}
                            onblur={formik.handleBlur}
                            error={
                                formik.errors.roomName &&
                                formik.touched.roomName
                                    ? formik.errors.roomName
                                    : ""
                            }
                            placeholder="請輸入房名"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <FillItem
                            ref={refWinnerAward}
                            name="winnerAward"
                            title="贏家獎勵"
                            type="text"
                            value={formik.values.winnerAward}
                            onchange={formik.handleChange}
                            onblur={formik.handleBlur}
                            error={
                                formik.errors.winnerAward &&
                                formik.touched.winnerAward
                                    ? formik.errors.winnerAward
                                    : ""
                            }
                            placeholder="請輸入贏家獎勵"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <FillItem
                            ref={refLoserAward}
                            name="loserAward"
                            title="輸家獎勵"
                            type="text"
                            value={formik.values.loserAward}
                            onchange={formik.handleChange}
                            onblur={formik.handleBlur}
                            error={
                                formik.errors.loserAward &&
                                formik.touched.loserAward
                                    ? formik.errors.loserAward
                                    : ""
                            }
                            placeholder="請輸入輸家獎勵"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <FillSelectItem
                            ref={refGameConditionKey}
                            name="gameConditionKey"
                            title="獲勝條件"
                            value={formik.values.gameConditionKey}
                            onchange={formik.handleChange}
                            onblur={formik.handleBlur}
                            error={
                                formik.errors.gameConditionKey &&
                                formik.touched.gameConditionKey
                                    ? formik.errors.gameConditionKey
                                    : ""
                            }
                            placeholder="請輸選擇獲勝條件"
                            options={options}
                        />
                    </div>
                    <div className="col-6">
                        <FillItem
                            ref={refGameConditionValue}
                            name="gameConditionValue"
                            title="獲勝值"
                            type="number"
                            value={formik.values.gameConditionValue}
                            onchange={formik.handleChange}
                            onblur={formik.handleBlur}
                            error={
                                formik.errors.gameConditionValue &&
                                formik.touched.gameConditionValue
                                    ? formik.errors.gameConditionValue
                                    : ""
                            }
                            placeholder="請輸入獲勝值"
                        />
                    </div>
                </div>
            </div>

            <div className="box_bottom">
                <div className="row">
                    <div className="col">
                        <button type="submit" className="btn btn-lg btn_style1">
                            新增
                        </button>
                    </div>
                </div>
                {isWaitingResult ? (
                    <>
                        <Split content={<small>系統訊息</small>} />
                        <div className="alert alert-info" role="alert">
                            作業中~
                        </div>
                    </>
                ) : null}

                {!isWaitingResult && errorMsg.length > 0 ? (
                    <>
                        <Split content={<small>系統訊息</small>} />
                        <div className="alert alert-danger" role="alert">
                            {errorMsg}
                        </div>
                    </>
                ) : null}
            </div>
        </form>
    );
};

export default AddGameRoomForm;
