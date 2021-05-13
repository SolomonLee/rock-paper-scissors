import React from "react";
import Gamering from "../combo/gameRoom/Gamering";

const PageGameRoom = (): JSX.Element => (
    <div className="container">
        <div className="row justify-content-md-center">
            <div className="col">
                <section className="gaming_block">
                    <div className="block_title" />
                    <div className="block_content">
                        <Gamering />
                    </div>
                </section>
            </div>
        </div>
    </div>
);

export default PageGameRoom;
