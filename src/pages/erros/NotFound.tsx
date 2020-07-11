import React from "react"
import {Button, Result} from "antd"


const NotFound = () => {
	return (
		<div className="mx-auto">
			<Result
				status="404"
				title="404"
				subTitle="Sorry, the page you visited does not exist."
				extra={<Button type="primary">Back Home</Button>}
			/>
		</div>
	)
}

export default NotFound