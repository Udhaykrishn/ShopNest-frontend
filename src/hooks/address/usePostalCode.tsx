import { useEffect, useState } from "react";

interface PincodeData {
    Status: string;
    Message: string;
    PostOffice: Array<{
        Name: string;
        Country: string;
        District: string;
        State: string;
    }>;
}

export const usePostalCode = (pincode: string) => {
    const [city, setCity] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [details, setDetails] = useState<{ District: string; State: string }>({
        District: "",
        State: "",
    });
    const [getResult, setIsSuccess] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!/^[1-9][0-9]{5}$/.test(pincode)) {
                setError("Invalid pincode format");
                setIsSuccess(false);
                return;
            }

            try {
                const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = (await response.json()) as PincodeData[];
                const result = data[0];

                if (result.Status === "Success" && result.PostOffice.length > 0) {
                    const cityList = result.PostOffice.map((po) => po.Name);
                    setCity(cityList);
                    setDetails({
                        District: result.PostOffice[0].District,
                        State: result.PostOffice[0].State,
                    });
                    setIsSuccess(true);
                    setError("");
                } else {
                    setError("No location found for this pincode");
                    setIsSuccess(false);
                    setCity([]);
                }
            } catch (err) {
                console.error("Pincode lookup error:", err);
                setError("Failed to fetch location data");
                setIsSuccess(false);
                setCity([]);
            }
        };

        if (pincode) {
            fetchData();
        }
    }, [pincode]);

    return { city, getResult, error, ...details };
};
