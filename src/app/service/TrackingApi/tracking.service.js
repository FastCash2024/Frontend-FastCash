const baseUrl = "https://api.fastcash-mx.com/api";
// const baseUrl = "http://localhost:3000/api";

export const postTracking = async (data) => {
    try {
        const response = await fetch(`${baseUrl}/trakingoperaciones/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return {
                data: errorData !== null && errorData !== undefined ? errorData : "Unknown error",
                status: response.status,
            };
        }

        const responseData = await response.json();
        return { data: responseData, status: response.status };
    } catch (error) {
        return {
            data: "Unexpected error",
            status: 500,
        };
    }
};