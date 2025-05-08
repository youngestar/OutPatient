import { reactive } from "vue";
import { defineStore } from "pinia";
import type {
  getDepartment,
  getClinic,
  department,
  clinic,
  doctor,
  schedule,
} from "@/api/patient/registrations";
import {
  getDepartmentRegistrations,
  getClinicRegistrations,
  getDoctorRegistrations,
  getDoctorSchedule,
  searchClinic,
  searchDoctor,
} from "@/api/patient/registrations";
import {
  createDepartRegistration,
  updeteDepartRegistration,
  deleteDepartRegistration,
  createClinicRegistration,
  deleteClinicRegistration,
  updeteClinicRegistration,
  createDoctorRegistration,
  updateDoctorRegistration,
  deleteDoctorRegistration,
  createScheduleRegistration,
  updateScheduleRegistration,
  deleteScheduleRegistration,
} from "@/api/admin/registrations";

function getCurrentDate(): {
  currentDate: string;
} {
  const currentDate = new Date();

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    // 月份从 0 开始，需 +1 并补零（如 1 月 → "01"）
    const month = String(date.getMonth() + 1).padStart(2, "0");
    // 日期补零（如 5 号 → "05"）
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return {
    currentDate: formatDate(currentDate),
  };
}

function getRoundedUpCurrentHour(): number {
  const now = new Date();
  const currentHour = now.getHours(); // 当前小时（0-23）
  const currentMinute = now.getMinutes(); // 当前分钟（0-59）

  // 分钟 > 0 时小时加 1，否则保持当前小时
  const roundedHour = currentMinute > 0 ? currentHour + 1 : currentHour;

  return roundedHour;
}

export const useHospitalStore = defineStore("hospital", () => {
  const departs: department[] = reactive([]);
  const clinics: clinic[] = reactive([]);
  const doctors = reactive<doctor[]>([]);
  const schedules: schedule[] = reactive([]);

  // 获取列表
  const getDepartments = async () => {
    const newDepartments = await getDepartmentRegistrations();
    if (!newDepartments) {
      console.error("获取科室列表失败");
      return;
    }
    departs.splice(0, departs.length, ...newDepartments);
  };

  const getClinics = async (departmentId: number) => {
    const newClinics = await getClinicRegistrations(departmentId);
    if (!newClinics) {
      console.error("获取门诊列表失败");
      return;
    }
    clinics.splice(0, clinics.length, ...newClinics);
  };

  const getDoctors = async (departmentId: number, clinicId: number) => {
    const newDoctors = await getDoctorRegistrations(departmentId, clinicId);
    if (!newDoctors) {
      console.error("获取医生列表失败");
      return;
    }
    doctors.splice(0, doctors.length, ...newDoctors);
  };

  const getSchedules = async (
    doctorId: number,
    title: string,
    startDate: string,
    endDate: string
  ) => {
    const getSchedules = await getDoctorSchedule(doctorId, title, startDate, endDate);
    if (!getSchedules) {
      console.error("获取医生排班失败");
      return;
    }
    const toDay = getCurrentDate().currentDate;
    const nowHour = getRoundedUpCurrentHour();

    const newSchedules = getSchedules.filter((schedule: schedule) => {
      return (
        schedule.scheduleDate !== toDay ||
        (schedule.scheduleDate === toDay && Number(schedule.timeSlot.split("-")[1]) <= nowHour)
      );
    });
    schedules.splice(0, schedules.length, ...newSchedules);
  };

  //搜索操作
  const searchForClinic = async (clinicName: string) => {
    const newClinics = await searchClinic(clinicName);
    if (!newClinics) {
      console.error("搜索门诊失败");
      return;
    }
    clinics.splice(0, clinics.length, ...newClinics);
  };

  const searchForDoctor = async (doctorName: string) => {
    const newDoctors = await searchDoctor(doctorName);
    if (!newDoctors) {
      console.error("搜索医生失败");
      return;
    }
    doctors.splice(0, doctors.length, ...newDoctors);
  };

  // 科室相关操作
  const createDepart = async (newName: string) => {
    const getDepart: getDepartment = await createDepartRegistration(newName);
    if (!getDepart) {
      console.error("创建科室失败");
      return;
    }
    const newDepart: department = {
      id: getDepart.deptId,
      name: getDepart.deptName,
      state: getDepart.isActive,
    };
    departs.push(newDepart);
  };

  const updateDepart = async (deptId: number, updetedDepartName: string) => {
    const getDepart: getDepartment = await updeteDepartRegistration(deptId, updetedDepartName);
    if (!getDepart) {
      console.error("更新科室失败");
      return;
    }
    const index = departs.findIndex((item) => item.id === deptId);
    departs[index].name = updetedDepartName;
  };

  const deleteDepart = async (deptId: number) => {
    const res = await deleteDepartRegistration(deptId);
    if (!res) {
      console.error("删除科室失败");
      return;
    }
    const index = departs.findIndex((item) => item.id === deptId);
    departs.splice(index, 1);
  };
  // 门诊相关操作
  const createClinic = async (deptId: number, newName: string) => {
    const getClinic: getClinic = await createClinicRegistration(deptId, newName);
    const newClinic: clinic = {
      id: getClinic.clinicId,
      name: getClinic.clinicName,
      state: getClinic.isActive,
    };
    if (!getClinic) {
      console.error("创建门诊失败");
      return;
    }
    clinics.push(newClinic);
  };

  const updateClinic = async (clinicId: number, updetedClinicName: string) => {
    const getClinic: getClinic = await updeteClinicRegistration(clinicId, updetedClinicName);
    if (!getClinic) {
      console.error("更新门诊失败");
      return;
    }
    const index = clinics.findIndex((item) => item.id === clinicId);
    clinics[index].name = updetedClinicName;
  };

  const deleteClinic = async (clinicId: number) => {
    const res = await deleteClinicRegistration(clinicId);
    if (!res) {
      console.error("删除门诊失败");
      return;
    }
    const index = clinics.findIndex((item) => item.id === clinicId);
    clinics.splice(index, 1);
  };
  // 医生相关操作
  const createDoctor = async (
    username: string,
    password: string,
    email: string,
    phone: string,
    clinicId: number,
    name: string,
    title: string,
    introduction: string,
    avatar: File,
    avatarUrl: string
  ) => {
    const getDoctor: doctor = await createDoctorRegistration(
      username,
      password,
      email,
      phone,
      clinicId,
      name,
      title,
      introduction,
      avatar
    );
    getDoctor.avatar = avatarUrl;
    if (!getDoctor) {
      console.error("创建医生失败");
      return;
    }
    doctors.push(getDoctor);
    return getDoctor;
  };

  const updateDoctor = async (
    doctorId: number,
    userId: number,
    username: string,
    password: string,
    email: string,
    phone: string,
    clinicId: number,
    name: string,
    title: string,
    introduction: string,
    avatar: File,
    avatarUrl: string
  ) => {
    const newDoctor: doctor = {
      doctorId,
      userId,
      name,
      title,
      introduction,
      avatar: avatarUrl,
      deptName: "",
    };
    const msg: doctor = await updateDoctorRegistration(
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
      avatar
    );
    if (!msg) {
      console.error("更新医生失败");
      return;
    }
    const index = doctors.findIndex((doctor) => {
      return doctor.doctorId === doctorId;
    });
    doctors[index] = newDoctor;
    return msg;
  };

  const deleteDoctor = async (doctorId: number) => {
    const msg = await deleteDoctorRegistration(doctorId);
    if (!msg) {
      console.error("删除医生失败");
      return;
    }
    const index = doctors.findIndex((doctor) => {
      return doctor.doctorId === doctorId;
    });
    doctors.splice(index, 1);
    return msg;
  };

  // 排班相关操作
  const createSchedule = async (
    doctorId: number,
    clinicId: number,
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
    const getSchedule = await createScheduleRegistration(
      doctorId,
      clinicId,
      scheduleDate,
      timeSlot,
      maxPatients,
      currentPatients,
      status,
      doctorName,
      doctorTitle,
      doctorIntroduction,
      doctorAvatar
    );
    if (!getSchedule) {
      console.error("创建排班失败");
      return;
    }
    schedules.push(getSchedule);
    return true;
  };

  const updateSchedule = async (
    scheduleId: number,
    doctorId: number,
    clinicId: number,
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
    const getSchedule = await updateScheduleRegistration(
      scheduleId,
      doctorId,
      clinicId,
      scheduleDate,
      timeSlot,
      maxPatients,
      currentPatients,
      status,
      doctorName,
      doctorTitle,
      doctorIntroduction,
      doctorAvatar
    );
    if (!getSchedule) {
      console.error("更新排班失败");
      return;
    }
    const index = schedules.findIndex((schedule) => {
      return schedule.scheduleId === scheduleId;
    });
    schedules[index] = getSchedule;
    return true;
  };

  const deleteSchedule = async (scheduleId: number) => {
    const res = await deleteScheduleRegistration(scheduleId);
    if (!res) {
      console.error("删除排班失败");
      return;
    }
    const index = schedules.findIndex((schedule) => {
      return schedule.scheduleId === scheduleId;
    });
    schedules.splice(index, 1);
    return true;
  };

  return {
    departs,
    clinics,
    doctors,
    schedules,
    getDepartments,
    getClinics,
    getDoctors,
    getSchedules,
    searchForClinic,
    searchForDoctor,
    createDepart,
    updateDepart,
    deleteDepart,
    createClinic,
    updateClinic,
    deleteClinic,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  };
});
