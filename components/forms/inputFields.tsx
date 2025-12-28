import React from 'react'
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {cn} from "@/lib/utils";

const InputFields = ({ name, label, placeholder, type = "text", register, error, validation, disabled, value }: FormInputProps) => {
    return (
        <div className="space-y-2">
            <Label htmlFor={name} className="text-sm font-medium text-gray-400">
                {label}
            </Label>
            <Input
                type={type}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                value={value}
                className={cn('h-12 px-3 py-3 text-white text-base placeholder:text-gray-500 border-gray-600 bg-gray-800 rounded-lg focus:border-yellow-500! focus:ring-0', { 'opacity-50 cursor-not-allowed': disabled })}
                {...register(name, validation)}
            />
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    )
}
export default InputFields