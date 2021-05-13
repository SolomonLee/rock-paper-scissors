import React from "react";
import GameRoomList from "../combo/gameRoomList/GameRoomList";

const PageHome = (): JSX.Element => (
    <div className="container">
        <div className="row justify-content-md-center">
            <div className="col-md-8 col-12">
                <GameRoomList />
            </div>
        </div>
    </div>
);

export default PageHome;
