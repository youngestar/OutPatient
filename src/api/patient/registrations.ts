import { DoAxiosWithErro } from "..";

// 获取数据接口
export interface getDepartment {
  deptId: number;
  deptName: string;
  isActive: number;
}

export interface getClinic {
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
    const res = await DoAxiosWithErro("/appointment/departments", "get", {}, true, false);
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
      "/appointment/clinics",
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
      "/appointment/doctors",
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

// 排班相关函数
export const getDoctorSchedule = async (
  deptId: number,
  clinicId: number,
  doctorId: number,
  title: string
) => {
  try {
    const res = await DoAxiosWithErro(
<<<<<<< HEAD
      "/api/appointment/schedules",
=======
      "/appointment/doctor-schedules",
>>>>>>> 0282fea0a574207f3e77247d24b1abe06f0fe886
      "post",

      { deptId, clinicId, doctorId, title, startDate: "2025-04-07", endDate: "2025-04-17" },
      true,
      true
    );
    console.log(res);
    // return res;
  } catch (err) {
    console.error(err);
  }
};

//挂号相关函数
const createRegistrations = async (patientId: number, scheduleId: number, isRevisit = 0) => {
  try {
    const res = await DoAxiosWithErro(
      "/appointment/create",
      "post",
      { patientId, scheduleId },
      true,
      true
    );
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

export const cancelRegistrations = async (appointmentId: number, patientId: number) => {
  try {
    const res = await DoAxiosWithErro(
      "/appointment/cancel",
      "post",
      { appointmentId, patientId },
      true,
      true
    );
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};
