import { DoAxiosWithErro } from "..";
import type { getDepartment, getClinic, doctor, schedule } from "@/api/patient/registrations";
//科室相关操作
export const createDepartRegistration = async (deptName: string) => {
  try {
    const res = await DoAxiosWithErro<getDepartment>(
      "/admin/department/add",
      "post",
      { deptName },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updeteDepartRegistration = async (deptId: string, updetedDepartName: string) => {
  try {
    const res = await DoAxiosWithErro<getDepartment>(
      "/admin/department/update",
      "post",
      { deptId, deptName: updetedDepartName },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const deleteDepartRegistration = async (deptId: string) => {
  try {
    const res = await DoAxiosWithErro<boolean>(
      "/admin/department/delete",
      "post",
      { deptId },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 门诊相关操作
export const createClinicRegistration = async (deptId: string, clinicName: string) => {
  try {
    const res = await DoAxiosWithErro<getClinic>(
      "/admin/clinic/add",
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

export const updeteClinicRegistration = async (
  deptId: string,
  clinicId: string,
  updetedClinicName: string
) => {
  try {
    const res = await DoAxiosWithErro<getClinic>(
      "/admin/clinic/update",
      "post",
      { deptId, clinicId, clinicName: updetedClinicName },
      true,
      true
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const deleteClinicRegistration = async (clinicId: string) => {
  try {
    const res = await DoAxiosWithErro<boolean>(
      "/admin/clinic/delete",
      "post",
      { clinicId },
      true,
      true
    );

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
  clinicId: string,
  name: string,
  title: string,
  introduction: string,
  avatarFile: File
) => {
  try {
    const formData = new FormData();
    formData.append("username", username ?? "");
    formData.append("password", password ?? "");
    formData.append("email", email ?? "");
    formData.append("phone", phone ?? "");
    formData.append("clinicId", clinicId ?? "");
    formData.append("name", name ?? "");
    formData.append("title", title ?? "");
    formData.append("introduction", introduction ?? "");
    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }

    // 后端返回值在不同实现中可能是 doctor 对象，也可能只返回新 doctorId（number/string）。
    const res = await DoAxiosWithErro<doctor | string | number>(
      "/admin/doctor/Doctor-add",
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
  doctorId: string,
  userId: string,
  username: string,
  password: string,
  email: string,
  phone: string,
  clinicId: string,
  name: string,
  title: string,
  introduction: string,
  avatarFile?: File | null
) => {
  try {
    const formData = new FormData();
    formData.append("doctorId", doctorId ?? "");
    formData.append("userId", userId ?? "");
    // 兼容“只改部分字段”的更新：空值不传，避免覆盖成空字符串
    if (username) formData.append("username", username);
    if (password) formData.append("password", password);
    if (email) formData.append("email", email);
    if (phone) formData.append("phone", phone);
    formData.append("clinicId", clinicId ?? "");
    formData.append("name", name ?? "");
    formData.append("title", title ?? "");
    formData.append("introduction", introduction ?? "");
    if (avatarFile) {
      formData.append("avatarFile", avatarFile);
    }

    const res = await DoAxiosWithErro<doctor>(
      "/admin/doctor/Doctor-update",
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

export const deleteDoctorRegistration = async (doctorId: string) => {
  try {
    const res = await DoAxiosWithErro<boolean>(
      "/admin/doctor/Doctor-delete",
      "post",
      { doctorId },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 排班相关操作
export const createScheduleRegistration = async (
  doctorId: string,
  clinicId: string,
  scheduleDate: string,
  timeSlot: string,
  maxPatients: number,
  currentPatients: number,
  status: number,
  doctorName: string,
  doctorTitle: string,
  doctorIntroduction: string,
  doctorAvatar: string
) => {
  try {
    const res = await DoAxiosWithErro<string>(
      "/admin/schedule/add",
      "post",
      { doctorId, clinicId, scheduleDate, timeSlot, maxPatients, currentPatients, status },
      true,
      true
    );
    const scheduleId = res as string;
    const newSchedule: schedule = {
      scheduleId,
      doctorId,
      doctorName,
      doctorTitle,
      doctorIntroduction,
      doctorAvatar,
      scheduleDate,
      timeSlot,
      remainingQuota: maxPatients - currentPatients,
      canBook: maxPatients - currentPatients > 0,
    };
    return newSchedule;
  } catch (err) {
    console.error(err);
  }
};

export const updateScheduleRegistration = async (
  scheduleId: string,
  doctorId: string,
  clinicId: string,
  scheduleDate: string,
  timeSlot: string,
  maxPatients: number,
  currentPatients: number,
  status: number,
  doctorName: string,
  doctorTitle: string,
  doctorIntroduction: string,
  doctorAvatar: string
) => {
  try {
    const res = await DoAxiosWithErro<boolean>(
      "/admin/schedule/update",
      "post",
      {
        scheduleId,
        doctorId,
        clinicId,
        scheduleDate,
        timeSlot,
        maxPatients,
        currentPatients,
        status,
      },
      true,
      true
    );
    if (!res) {
      return null;
    }
    const newSchedule: schedule = {
      scheduleId,
      doctorId,
      doctorName,
      doctorTitle,
      doctorIntroduction,
      doctorAvatar,
      scheduleDate,
      timeSlot,
      remainingQuota: maxPatients - currentPatients,
      canBook: maxPatients - currentPatients > 0,
    };
    return newSchedule;
  } catch (err) {
    console.error(err);
  }
};

export const deleteScheduleRegistration = async (scheduleId: string) => {
  try {
    const res = await DoAxiosWithErro<boolean>(
      "/admin/schedule/delete",
      "post",
      { scheduleId },
      true,
      true
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};

// 自动排班操作
export const autoUpdateSchedules = async (
  startDate: string,
  endDate: string,
  clinicId?: string
) => {
  try {
    const payload: Record<string, string | undefined> = {
      startDate,
      endDate,
      clinicId,
    };
    const res = await DoAxiosWithErro("/admin/schedule/auto", "post", payload, true, true);
    return res;
  } catch (err) {
    console.error("自动更新排班失败:", err);
    throw err; // 可选：向上抛出错误以便上层处理
  }
};
