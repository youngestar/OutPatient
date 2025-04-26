import { number } from "echarts";
import { DoAxiosWithErro } from "..";

//科室相关操作
export const createDepartRegistration = async (deptName: string) => {
  try {
    const res = await DoAxiosWithErro("/api/admin/department", "post", { deptName }, true, true);

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updeteDepartRegistration = async (deptId: number, updetedDepartName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/api/admin/department",
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
    const res = await DoAxiosWithErro(`/api/admin/department/${deptId}`, "delete", {}, true, false);

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 门诊相关操作
export const createClinicRegistration = async (deptId: number, clinicName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/api/admin/clinic",
      "post",
      { deptId, clinicName },
      true,
      true
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updeteClinicRegistration = async (clinicId: number, updetedClinicName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/api/admin/clinic",
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
    const res = await DoAxiosWithErro(`/api/admin/clinic/${clinicId}`, "delete", {}, true, false);

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 医生相关操作

// 这里使用 FormData 来处理文件上传
export const createDoctorRegistration = async (
  clinicId: number,
  name: string,
  title: string,
  introduction: string
) => {
  try {
    // 创建 FormData 对象并添加参数
    const formData = new FormData();
    formData.append("clinicId", String(clinicId)); // 数值类型需转为字符串
    formData.append("name", name);
    formData.append("title", title);
    formData.append("introduction", introduction);

    const res = await DoAxiosWithErro(
      "/api/admin/doctor",
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
