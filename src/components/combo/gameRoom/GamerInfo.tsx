import React from "react";
import { gamerResultMap, RoomGamer } from "../../../apis/gameRooms";

interface Props {
    roomGamer: RoomGamer;
}

const GamerInfo = ({ roomGamer }: Props): JSX.Element => (
    <div className="gamer_info_item">
        <div className="item_title">
            {roomGamer.result !== gamerResultMap.Gaming ? (
                <div className="gamer_result" data-result={roomGamer.result}>
                    {roomGamer.result === gamerResultMap.Winner
                        ? "贏家"
                        : "輸家"}
                </div>
            ) : (
                <div
                    className="gamer_ready"
                    data-ready={roomGamer.ready ? "" : null}
                >
                    {roomGamer.ready ? "準備完成" : "還在考慮"}
                </div>
            )}
        </div>
        <div className="item_content">
            <p>玩家: {roomGamer.name}</p>
            {roomGamer.prevChoose !== "" ? (
                <p>上次選擇: {roomGamer.prevChoose}</p>
            ) : null}
        </div>
    </div>
);

export default GamerInfo;
