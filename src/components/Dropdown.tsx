import type { ReactNode } from "react"

const Alings = {
    left: 'dropdown-left',
    right: 'dropdown-right',
    bottom: 'dropdown-bottom',
    top: 'dropdown-top',
    end: 'dropdown-end',
    default: '',
} as const

const Modifiers = {
    hover: 'dropdown-hover',
    open: 'dropdown-open',
    default: '',
} as const

export interface DropdownProps {
    className?: string
    classButton?: string
    classContent?: string
    aling?: keyof typeof Alings
    modifier?: keyof typeof Modifiers
    button?: ReactNode
    content?: ReactNode
}

export default function Dropdown(props: DropdownProps) {
    const { button, content } = props
    const { classButton, classContent } = props
    return (
        <div className={`dropdown ${props.className || ''} ${Alings[props.aling || 'default']} ${Modifiers[props.modifier || 'default']}`.trim()}>
            <div tabIndex={0} role="button" className={classButton}>{button}</div>
            <div tabIndex={0} className={`dropdown-content z-[1] shadow bg-base-100 rounded-box w-56 ${classContent || ""}`.trim()}>
                {content}
            </div>
        </div>
    )
}