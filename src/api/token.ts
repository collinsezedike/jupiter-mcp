import axios from "axios";

const JUP_API_URL = "https://lite-api.jup.ag/tokens/v1";

const headers = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

export const getAllTokens = async () => {
	try {
		let config = {
			method: "GET",
			url: `${JUP_API_URL}/all`,
			headers,
		};

		const response = await axios.request(config);
		return response.data;
	} catch (error) {
		console.error(error);
	}
};
