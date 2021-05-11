import React, {
    FocusEventHandler,
    ChangeEvent,
    useRef,
    useImperativeHandle,
    forwardRef,
} from "react";

import { FillHandle } from "./FillInterface";

export interface Option {
    title: string;
    value: string;
}

interface Props {
    title: string | null;
    error: string | null;
    placeholder: string | null;
    value: string | number;
    name: string;
    options: Option[];
    onchange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onblur: FocusEventHandler<HTMLSelectElement> | undefined;
}

export type FillSelItemHandle = {
    disabled: () => void;
    undisabled: () => void;
};

const FillItem: React.ForwardRefRenderFunction<FillHandle, Props> = (
    {
        title = null,
        error = null,
        placeholder = null,
        value,
        name,
        options,
        onchange,
        onblur = undefined,
    }: Props,
    forwardedRef
): JSX.Element => {
    const inputRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(forwardedRef, () => ({
        disabled: () => {
            if (
                inputRef.current !== null &&
                inputRef.current.disabled !== null
            ) {
                inputRef.current.disabled = true;
            }
        },
        undisabled: () => {
            if (
                inputRef.current !== null &&
                inputRef.current.disabled !== null
            ) {
                inputRef.current.disabled = false;
            }
        },
    }));
    return (
        <div className="fill_item" data-error={error ? "" : null}>
            {title ? <div className="item_title">{title}</div> : null}
            <div className="item_input">
                {placeholder && value === "" ? (
                    <div className="placeholder">{placeholder}</div>
                ) : null}
                <select
                    ref={inputRef}
                    name={name}
                    value={value}
                    onChange={onchange}
                    onBlur={onblur}
                    className="form-control"
                >
                    {options.map((option) => (
                        <option
                            key={`${option.value}${option.title}`}
                            value={option.value}
                        >
                            {option.title}
                        </option>
                    ))}
                </select>
                {error && error !== "" ? (
                    <div className="error">{error}</div>
                ) : null}
            </div>
        </div>
    );
};

export default forwardRef(FillItem);
