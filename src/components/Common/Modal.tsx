import React, {Dispatch, PropsWithChildren, SetStateAction} from "react"

type ModalProps = {
    visible: boolean,
    visibleFn: Dispatch<SetStateAction<boolean>>
}
const Modal: React.FC<PropsWithChildren<ModalProps>> = ({children, visible = false, visibleFn}) => {
	return (
		<>
			{visible ? (
				<>
					<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
						<div className="bg-white rounded relative w-auto my-6 mx-auto max-w-3xl">
							<div>
								<button
									className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
									onClick={() => visibleFn(false)}
								>
									<span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
								</button>
							</div>
							<div>
								{children}
							</div>
						</div>
					</div>
					<div className="opacity-25 fixed inset-0 z-40 bg-black"/>
				</>
			) : null}
		</>
	)
}

export default Modal
