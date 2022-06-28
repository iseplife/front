import React, {CSSProperties} from "react"
import "./LoadingSpinner.css"

type LoadingSpinnerProps = {
    className?: string
    style?: CSSProperties
}
const LoadingSpinner: React.FC<LoadingSpinnerProps> = (p) => 
    <div className={`showbox grid place-items-center ${p.className}`} style={p.style}>
        <div className="loader">
            <svg className="circular" viewBox="25 25 50 50">
                <circle className="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
            </svg>
        </div>
    </div>

LoadingSpinner.defaultProps = {
    className: ""
}

export default LoadingSpinner
