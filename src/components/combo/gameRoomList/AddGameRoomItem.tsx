import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { InsertGameRoomInfo } from "../../../apis/gameRooms";
import { joinGameRoomAsync } from "../../../reducers/gamerRedux";
import {
    selectLastCreateGameRoomId,
    selectOnInsertGameRoom,
    selectGameConditions,
    insertGameRoomAsync,
    clearLastRoomId,
} from "../../../reducers/roomsInfoRedux";
import AddGameRoomForm from "../form/gameRoom/AddGameRoomForm";
import Modal from "../modal/Modal";

const AddGameRoomItem = (): JSX.Element | null => {
    // const [errorMsg, setErrorMsg] = useState("");
    const errorMsg = "";
    const [isOpen, setIsOpen] = useState(false);
    const onInsertGameRoom = useSelector(selectOnInsertGameRoom);
    const gameConditions = useSelector(selectGameConditions);
    const lastCreateGameRoomId = useSelector(selectLastCreateGameRoomId);

    const dispatch = useDispatch();

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    const handleShowModal = () => {
        setIsOpen(true);
    };

    const handleAddGameRoom = (gc: InsertGameRoomInfo) => {
        dispatch(insertGameRoomAsync(gc));
    };

    useEffect(() => {
        if (onInsertGameRoom) handleShowModal();
        else {
            handleCloseModal();
            if (lastCreateGameRoomId !== "") {
                dispatch(joinGameRoomAsync(lastCreateGameRoomId));
                dispatch(clearLastRoomId());
            }
        }
    }, [onInsertGameRoom]);

    if (gameConditions.length === 0) return null;

    return (
        <>
            <button
                type="button"
                className="btn btn_style1"
                onClick={handleShowModal}
            >
                新增戰局
            </button>
            <Modal isOpen={isOpen} setClose={handleCloseModal} stylenum={1}>
                <AddGameRoomForm
                    addGameRoomFunction={handleAddGameRoom}
                    gameConditions={gameConditions}
                    isWaitingResult={onInsertGameRoom}
                    errorMsg={errorMsg}
                />
            </Modal>
        </>
    );
};

export default AddGameRoomItem;
