import React from "react";
import { RoomGamer } from "../../../apis/gameRooms";
import GamerInfo from "./GamerInfo";

interface Props {
    roomGamers: RoomGamer[];
}

const GamerOther = ({ roomGamers }: Props): JSX.Element => (
    <div className="gamer_self_box">
        <div className="box_title">其他人在這邊</div>
        <div className="box_content">
            <ul>
                {roomGamers.map((roomGamer) => (
                    <li key={roomGamer.name}>
                        <GamerInfo roomGamer={roomGamer} />
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export default GamerOther;
