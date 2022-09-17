import React from 'react'

type Props = {
    text?: string,
    icon?: JSX.Element
}

export default function SubmitButton({ text = '', icon }: Props) {
    return (
        <button className="cursor-pointer bg-blue-500 rounded-md dark:bg-slate-500 text-white hover:scale-125 transition-all duration-300" type="submit">
            <span>{text}</span>
            {icon && icon}
        </button>
    )
}