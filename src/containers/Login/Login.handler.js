import axios from "axios";
import constants from "../../constants";

const { BASE_URL } = constants;

const loginUser = async (payload) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/login`, payload);

    return data; 
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export default {
  loginUser,
};
