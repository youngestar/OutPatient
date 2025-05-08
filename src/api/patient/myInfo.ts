import { DoAxiosWithErro } from "..";

// 头像修改
export const updateUserAvatar = async (avatar: File) => {
  try {
    const formData = new FormData();
    formData.append("file", avatar, avatar.name); // 这里的 avatar.name 是文件的原始名称
    const res = await DoAxiosWithErro("/auth/updateAvatar", "post", formData, true, false);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const getUesrInfo = async () => {
  try {
    const res = await DoAxiosWithErro("/auth/currentUser", "get", {}, true, false);
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

export const updateUserInfo = async (
  name: string,
  gender: number,
  age: number,
  region: string,
  address: string,
  phone: string,
  IDCard: string
) => {
  try {
    const res = await DoAxiosWithErro(
      "/auth/updateInfo",
      "post",
      {
        name,
        gender,
        age,
        region,
        address,
        phone,
        IDCard,
      },
      true,
      true
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};
