interface AddEventTextFieldProps {
    className?: string
    title: string
    children: React.ReactElement
}
const AddEventTextField: React.FC<AddEventTextFieldProps> = ({title, children, className = ""}) =>
    <div className={`relative ${className}`} >
        <div className="absolute top-1 left-3.5 text-xs text-neutral-500 pointer-events-none">
            {title}
        </div>
        {children}
    </div>

export default AddEventTextField