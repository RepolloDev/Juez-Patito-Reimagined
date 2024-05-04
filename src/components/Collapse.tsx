import type { ReactNode } from 'react'

const Types = {
    plus: 'collapse-plus',
    arrow: 'collapse-arrow',
    default: "",
} as const

const Modifier = {
    open: 'collapse-open',
    close: 'collapse-close',
    default: "",
} as const

interface Props {
    className?: string
    classButton?: string
    classContent?: string
    type?: keyof typeof Types
    modifier?: keyof typeof Modifier
    button?: ReactNode
    content?: ReactNode
}

export default function Collapse(props: Props) {
    const { button, content } = props
    const { classButton, classContent } = props
    const { className, type, modifier } = props
    return (
        <div className={`collapse ${className} ${Types[type || "default"]} ${Modifier[modifier || "default"]}`.trim()}>
            <input type="checkbox" className="w-full" />
            <div className={`collapse-title ${classButton}`.trim()}>
                {button}
            </div>
            <div className={`collapse-content ${classContent}`.trim()}>
                {content}
            </div>
        </div>

    )
}