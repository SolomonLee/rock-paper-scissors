import React from "react";
import User from "./User";

const Header = (): JSX.Element => (
    <div className="header">
        <div className="logo">
            <img src="logo192.png" alt="" />
        </div>
        <div className="title">剪刀石頭布 v1.0</div>
        <User />
    </div>
);
export default Header;
