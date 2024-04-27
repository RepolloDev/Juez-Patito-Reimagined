import { CheckCircle, Warning, XCircle, Info, X } from "@phosphor-icons/react"
import { useState, useEffect } from "react";
import type { ReactElement } from "react"

const Types = {
    success: {
        icon: CheckCircle,
        color: 'alert-success'
    },
    warning: {
        icon: Warning,
        color: 'alert-warning'
    },
    error: {
        icon: XCircle,
        color: 'alert-error'
    },
    info: {
        icon: Info,
        color: 'alert-info'
    },
    default: {
        icon: Info,
        color: 'alert-info'
    }
} as const

interface AlertProps {
    title?: string;
    children: string | ReactElement[];
    id: string;
    type?: keyof typeof Types;
    persist?: boolean;
    className?: string;
}

export default function Alert({ title, children, id, type, persist = false, className }: AlertProps) {
    const [visible, setVisible] = useState(!persist)
    useEffect(() => {
        if (persist) {
            const value = localStorage.getItem(id)
            if (value === 'false') {
                setVisible(false)
            } else {
                setVisible(true)
            }
        }
    }, [])

    if (!visible) return null

    function handleClose() {
        setVisible(false)
        if (persist) {
            localStorage.setItem(id, 'false')
        }
    }

    const style = type || 'default'
    const Icon = Types[style].icon
    return (
        <div id={id} className={`alert shadow-lg ${Types[style].color} ${className ?? ""}`}>
            <Icon size={24} className="icon" />
            <div>
                {title && <h3 className='font-bold'>{title}</h3>}
                <div className="text-xs">{children}</div>
            </div>
            <button onClick={() => handleClose()} className="close btn btn-circle btn-ghost btn-sm">
                <X size={16} />
            </button>
        </div>
    )
}