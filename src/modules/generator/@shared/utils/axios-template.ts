import Axios from 'axios';

export const AxiosGeneratorTemplate = Axios.create({
    baseURL: 'http://207.32.218.146',
    withCredentials: true,
    validateStatus: () => true,
    headers: {
        "Authorization": "c0119c7b-1c38-49a7-8f16-6001991fa323-dbd7b447-d230-4cc5-9ddf-e489a903a27e-9acf9aab-a2ab-41a8-843b-fc8ffafabfdb-be5875d5-a5de-4fa8-9087-4a19b2118d09"
    }
})