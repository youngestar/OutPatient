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

export const updeteDepartRegistration = async (updetedDepartName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/api/admin/department",
      "put",
      { deptName: updetedDepartName },
      true,
      true
    );

    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

export const deleteDepartRegistration = async (deptId: number) => {
  try {
    const res = await DoAxiosWithErro(`/api/admin/department/${deptId}`, "delete", {}, true, false);

    console.log(res);
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
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updeteClinicRegistration = async (updetedClinicName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/api/admin/clinic",
      "put",
      { deptName: updetedClinicName },
      true,
      true
    );

    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

export const deleteClinicRegistration = async (clinicId: number) => {
  try {
    const res = await DoAxiosWithErro(`/api/admin/clinic/${clinicId}`, "delete", {}, true, false);

    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

// 医生相关操作
export const createDoctorRegistration = async (
  clinicId: number,
  name: string,
  title: string,
  introduction: string
) => {
  try {
    const res = await DoAxiosWithErro(
      "/api/admin/doctor",
      "post",
      { clinicId, name, title, introduction },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};
