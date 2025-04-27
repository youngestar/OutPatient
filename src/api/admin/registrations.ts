import { number } from "echarts";
import { DoAxiosWithErro } from "..";

//科室相关操作
export const createDepartRegistration = async (deptName: string) => {
  try {
    const res = await DoAxiosWithErro("/admin/department", "post", { deptName }, true, true);

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updeteDepartRegistration = async (deptId: number, updetedDepartName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/admin/department",
      "put",
      { deptId, deptName: updetedDepartName },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const deleteDepartRegistration = async (deptId: number) => {
  try {
    const res = await DoAxiosWithErro(`/admin/department/${deptId}`, "delete", {}, true, false);

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 门诊相关操作
export const createClinicRegistration = async (deptId: number, clinicName: string) => {
  try {
    const res = await DoAxiosWithErro("/admin/clinic", "post", { deptId, clinicName }, true, true);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updeteClinicRegistration = async (clinicId: number, updetedClinicName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/admin/clinic",
      "put",
      { clinicId, clinicName: updetedClinicName },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const deleteClinicRegistration = async (clinicId: number) => {
  try {
    const res = await DoAxiosWithErro(`/admin/clinic/${clinicId}`, "delete", {}, true, false);

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 医生相关操作
export const createDoctorRegistration = async (
  username: string,
  password: string,
  email: string,
  phone: string,
  clinicId: number,
  name: string,
  title: string,
  introduction: string
) => {
  try {
    // 这里使用 FormData 来处理文件上传
    // 创建 FormData 对象并添加参数
    const formData = new FormData();
    const doctorInfo = {
      username,
      password,
      email,
      phone,
      clinicId,
      name,
      title,
      introduction,
    };
    // 更替为二进制文件符合 form-data 形式
    formData.append(
      "doctorInfo",
      new Blob([JSON.stringify(doctorInfo)], {
        type: "application/json",
      })
    );

    const res = await DoAxiosWithErro(
      "/admin/doctor",
      "post",
      formData, // 直接传递 FormData 对象
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updateDoctorRegistration = async (
  doctorId: number,
  userId: number,
  username: string,
  password: string,
  email: string,
  phone: string,
  clinicId: number,
  name: string,
  title: string,
  introduction: string
) => {
  try {
    // 这里使用 FormData 来处理文件上传
    // 创建 FormData 对象并添加参数
    const formData = new FormData();
    const doctorInfo = {
      doctorId,
      userId,
      username,
      password,
      email,
      phone,
      clinicId,
      name,
      title,
      introduction,
    };
    // 更替为二进制文件符合 form-data 形式
    formData.append(
      "doctorInfo",
      new Blob([JSON.stringify(doctorInfo)], {
        type: "application/json",
      })
    );

    const res = await DoAxiosWithErro(
      "/admin/doctor",
      "put",
      formData, // 直接传递 FormData 对象
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const deleteDoctorRegistration = async (doctorId: number) => {
  try {
    const res = await DoAxiosWithErro(
      `/admin/doctor/${doctorId}`,
      "delete",
      { doctorId }, // 直接传递 FormData 对象
      true,
      false
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 搜索查找医生
// export const;
