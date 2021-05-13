import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Modal from "../modal/Modal";
import {
    joinGameRoomAsync,
    selectOnChangeJoinRoom,
} from "../../../reducers/gamerRedux";
import FillItem from "../fillitem/FillItem";
import { FillHandle } from "../fillitem/FillInterface";

const FastJoinGameRoomItem = (): JSX.Element => {
    const dispatch = useDispatch();
    const onChangeJoinRoom = useSelector(selectOnChangeJoinRoom);
    const [isOpen, setIsOpen] = useState(false);
    const [roomId, setRoomId] = useState("");
    const refInput = useRef<FillHandle>(null);

    const handleShowModal = () => {
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRoomId(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        refInput.current?.disabled();
        dispatch(joinGameRoomAsync(roomId));
    };

    useEffect(() => {
        if (isOpen) {
            setIsOpen(false);
        }

        if (onChangeJoinRoom) {
            refInput.current?.disabled();
        } else {
            refInput.current?.undisabled();
            setRoomId("");
        }
    }, [onChangeJoinRoom]);

    return (
        <>
            <button
                type="button"
                className="btn btn_style1"
                onClick={handleShowModal}
            >
                快入加入
            </button>
            <Modal isOpen={isOpen} setClose={handleCloseModal} stylenum={1}>
                <form className="form_box" onSubmit={handleSubmit}>
                    <div className="box_title">加入戰局</div>
                    <div className="box_content">
                        <div className="row">
                            <div className="col-12">
                                <FillItem
                                    ref={refInput}
                                    name="roomId"
                                    title="戰局ID"
                                    type="text"
                                    value={roomId}
                                    onchange={handleChange}
                                    onblur={undefined}
                                    error=""
                                    placeholder="請輸入贏家獎勵"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="box_bottom">
                        <div className="row">
                            <div className="col">
                                <button
                                    type="submit"
                                    className="btn btn-lg btn_style1"
                                >
                                    加入
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default FastJoinGameRoomItem;
