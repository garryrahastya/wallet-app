import axios from "axios";
import constants from "../../constants";

const { BASE_URL } = constants;

const registerUser = async (payload) => {
  try {
    const { data } = await axios.post(`${BASE_URL}/auth/register`, payload);
    // Mendapatkan ID pengguna yang baru terdaftar
    const userId = data.user.id;
    
    // Menambahkan properti friends dengan nilai awal sebagai array kosong
    await axios.patch(`${BASE_URL}/users/${userId}`, { friends: [] });

    return data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export default {
  registerUser,
};
