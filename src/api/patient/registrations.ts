import { DoAxiosWithErro } from "..";

// 获取数据接口
interface getDepartment {
  deptId: number;
  deptName: string;
  isActive: number;
}

interface getClinic {
  clinicId: number;
  clinicName: string;
  isActive: number;
}

// 传出数据接口
export interface department {
  name: string;
  state: number;
  id: number;
}

export interface clinic {
  name: string;
  state: number;
  id: number;
}

export interface doctor {
  doctorId: number;
  name: string;
  title: string;

  introduction: string;

  avatar: string;

  deptName: string;
}

// 加载页面函数
export const getDepartmentRegistrations = async () => {
  try {
    const res = await DoAxiosWithErro(`/api/appointment/departments`, "get", {}, true, false);
    const departmentsData = res.map((department: getDepartment) => {
      return {
        name: department.deptName,
        state: department.isActive,
        id: department.deptId,
      };
    });
    return departmentsData;
  } catch (err) {
    console.error(err);
  }
};

export const getClinicRegistrations = async (departmentId: number) => {
  try {
    const res = await DoAxiosWithErro(
      `/api/appointment/clinics`,
      "get",
      { deptId: departmentId },
      true,
      false
    );
    const clinicsData = res.map((clinic: getClinic) => {
      return {
        name: clinic.clinicName,
        state: clinic.isActive,
        id: clinic.clinicId,
      };
    });
    return clinicsData;
  } catch (err) {
    console.error(err);
  }
};

export const getDoctorRegistrations = async (departmentId: number, clinicId: number) => {
  try {
    const res = await DoAxiosWithErro(
      `/api/appointment/doctors`,
      "get",
      { deptId: departmentId, clinicId: clinicId },
      true,
      false
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};
