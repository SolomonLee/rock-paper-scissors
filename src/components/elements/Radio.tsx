import React from "react";

interface Props<T> {
    children: string;
    thisValue: T;
    value: T;
    setValue: (val: T) => void;
}

function Radio<T>({
    children,
    thisValue,
    value,
    setValue,
}: Props<T>): JSX.Element {
    const handleChange = () => {
        setValue(thisValue);
    };

    return (
        <span className="radio_item">
            <input
                type="radio"
                onChange={handleChange}
                checked={thisValue === value}
            />
            <span>{children}</span>
        </span>
    );
}

export default Radio;
