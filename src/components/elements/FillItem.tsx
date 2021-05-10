import React, { FocusEventHandler, ChangeEvent } from "react";

interface Props {
    title: string | null;
    error: string | null;
    placeholder: string | null;
    value: string | number;
    name: string;
    type: string;
    onchange: (e: ChangeEvent<HTMLInputElement>) => void;
    onblur: FocusEventHandler<HTMLInputElement> | undefined;
}

const FillItem = ({
    title = null,
    error = null,
    placeholder = null,
    value,
    name,
    type,
    onchange,
    onblur = undefined,
}: Props): JSX.Element => {
    console.log("test");

    return (
        <div className="fill_item" data-error={error ? "" : null}>
            {title ? <div className="item_title">{title}</div> : null}
            <div className="item_input">
                {placeholder && value === "" ? (
                    <div className="placeholder">{placeholder}</div>
                ) : null}
                <input
                    name={name}
                    type={type}
                    value={value}
                    onChange={onchange}
                    onBlur={onblur}
                    className="form-control"
                />
                {error && error !== "" ? (
                    <div className="error">{error}</div>
                ) : null}
            </div>
        </div>
    );
};

export default FillItem;
