import { DoAxiosWithErro } from "..";
export const getUesrInfo = async () => {
  try {
    const res = await DoAxiosWithErro("/api/auth/currentUser", "get", {}, true, false);
    const userInfo = {
      avatar: res.avatar,
      name: res.name,
      gender: res.gender,
      age: res.age,
      region: res.region,
      address: res.address,
      phone: res.phone,
      email: res.email,
      IDCard: res.idCard,
      userId: res.userId,
      doctorId: res.doctorId,
    };
    return userInfo;
  } catch (err) {
    console.error(err);
  }
};
