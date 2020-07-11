export const getCookie = (name: string): string | undefined => {
	const matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
	))
	return matches ? decodeURIComponent(matches[1]) : undefined
}


type CookieOptions = {
    "path"?: string,
    "domain"?: string,
    "expires"?: Date | string,
    "max-age"?: number,
    "secure"?: boolean,
    "samesite"?: string,
}

export const setCookie = (name: string, value: string, options: CookieOptions = {}): void => {
	options = {
		path: "/",
		// add other defaults here if necessary
		...options
	}

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString()
	}

	let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value)
	Object.entries(options).forEach(option => {
		updatedCookie += "; " + option[0] +"="+option[1]
	})

	document.cookie = updatedCookie
}


export const removeCookie = (name: string) => setCookie(name, "", {"max-age": -1})
