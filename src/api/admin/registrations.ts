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

export const updeteClinicRegistration = async (clinicId: string, updetedClinicName: string) => {
  try {
    const res = await DoAxiosWithErro<getClinic>(
      "/admin/clinic/update",
      "post",
      { clinicId, clinicName: updetedClinicName },
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
      "doctorRequest",
      new Blob([JSON.stringify(doctorInfo)], {
        type: "application/json",
      })
    );
    formData.append("avatarFile", avatarFile);

    const res = await DoAxiosWithErro<doctor>(
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
  avatarFile: File
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
      "doctorRequest",
      new Blob([JSON.stringify(doctorInfo)], {
        type: "application/json",
      })
    );
    formData.append("avatarFile", avatarFile);

    const res = await DoAxiosWithErro<doctor>(
      "/admin/doctor/Doctor-update",
      "post",
      formData, // 直接传递 FormData 对象
      true,
      true
    );

    console.log("头像", avatarFile);
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
