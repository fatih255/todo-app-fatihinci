import React from 'react'
import cn from 'classnames'

type Props = {
    labelText: string,
    fieldName: string,
    errorState?: string | null | undefined,

}

export default function LabelFormInput({ labelText, fieldName, errorState }: Props) {
    return (
        <div className="flex flex-col gap-2">
            <label className="dark:text-white" htmlFor={fieldName}>{labelText}</label>
            <input id={fieldName} name={fieldName} minLength={3}
                className={cn('border  focus:border-blue-400 rounded-lg focus-within:outline-none leading-relaxed py-2 px-4',
                    {
                        'border-gray-300': errorState !== fieldName,
                        'border-red-300': errorState === fieldName
                    }
                )} type="text" min="3" />
        </div>
    )
}
