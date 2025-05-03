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
  getAllDoctorRegistrations,
  getDoctorSchedule,
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
} from "@/api/admin/registrations";

export const useHospitalStore = defineStore("hospital", () => {
  const departs: department[] = reactive([]);
  const clinics: clinic[] = reactive([]);
  const doctors = reactive<doctor[]>([]);
  const schedules: schedule[] = reactive([]);

  // 获取列表
  const getDepartments = async () => {
    const newDepartments = await getDepartmentRegistrations();
    departs.splice(0, departs.length, ...newDepartments);
  };

  const getClinics = async (departmentId: number) => {
    const newClinics = await getClinicRegistrations(departmentId);
    clinics.splice(0, clinics.length, ...newClinics);
  };

  const getDoctors = async (departmentId: number, clinicId: number) => {
    const newDoctors = await getDoctorRegistrations(departmentId, clinicId);
    doctors.splice(0, doctors.length, ...newDoctors);
  };

  // 待修正
  const getAllDoctors = async () => {
    const newDoctors = await getAllDoctorRegistrations();
    doctors.splice(0, doctors.length, ...newDoctors);
  };

  const getSchedules = async (
    doctorId: number,
    title: string,
    startDate: string,
    endDate: string
  ) => {
    const newSchedules = await getDoctorSchedule(doctorId, title, startDate, endDate);
    schedules.splice(0, schedules.length, ...newSchedules);
  };

  // 科室相关操作
  const createDepart = async (newName: string) => {
    const getDepart: getDepartment = await createDepartRegistration(newName);
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
    introduction: string
  ) => {
    const getDoctor: doctor = await createDoctorRegistration(
      username,
      password,
      email,
      phone,
      clinicId,
      name,
      title,
      introduction
    );
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
    introduction: string
  ) => {
    const newDoctor: doctor = {
      doctorId,
      userId,
      name,
      title,
      introduction,
      avatar: "",
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
      introduction
    );
    const index = doctors.findIndex((doctor) => {
      return doctor.doctorId === doctorId;
    });
    doctors[index] = newDoctor;
    return msg;
  };

  const deleteDoctor = async (doctorId: number) => {
    const msg = await deleteDoctorRegistration(doctorId);
    const index = doctors.findIndex((doctor) => {
      return doctor.doctorId === doctorId;
    });
    doctors.splice(index, 1);
    return msg;
  };

  return {
    departs,
    clinics,
    doctors,
    schedules,
    getDepartments,
    getClinics,
    getDoctors,
    getAllDoctors,
    getSchedules,
    createDepart,
    updateDepart,
    deleteDepart,
    createClinic,
    updateClinic,
    deleteClinic,
    createDoctor,
    updateDoctor,
    deleteDoctor,
  };
});
