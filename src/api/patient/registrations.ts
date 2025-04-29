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
  userId: number;
  name: string;
  title: string;

  introduction: string;

  avatar: string;

  deptName: string;
}

export interface schedule {
  cardType: string;
  scheduleId: number;
  doctorId: number;
  doctorName: string;
  doctorTitle: string;
  doctorIntroduction: string;
  doctorAvatar: string;
  scheduleDate: string;
  timeSlot: string;
  remainingQuota: number;
  canBook: boolean;
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
export const getDoctorSchedule = async (
  doctorId: number,
  title: string,
  startDate: string,
  endDate: string
) => {
  try {
    const res = await DoAxiosWithErro(
      "/appointment/schedules",
      "post",
      { doctorId, title, startDate, endDate },
      true,
      true
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};

//挂号相关函数
export const createRegistrations = async (patientId: number, scheduleId: number) => {
  try {
    const res = await DoAxiosWithErro(
      "/appointment/create",
      "post",
      { patientId, scheduleId },
      true,
      true
    );
    console.log(res);
    return res;
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

// 搜索相关函数
export const searchClinic = async (name: string) => {
  try {
    const res = await DoAxiosWithErro("/appointment/clinics/search", "get", { name }, true, false);
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

export const searchDoctor = async (name: string) => {
  try {
    const res = await DoAxiosWithErro("/appointment/doctors", "get", { name }, true, false);
    return res;
  } catch (err) {
    console.error(err);
  }
};
