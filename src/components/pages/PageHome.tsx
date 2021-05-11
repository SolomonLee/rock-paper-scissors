import React from "react";
import GameRoomList from "../combo/gameRoom/GameRoomList";

const PageHome = (): JSX.Element => {
    console.log("test");
    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-4">
                    <GameRoomList />
                </div>
            </div>
        </div>
    );
};

export default PageHome;
