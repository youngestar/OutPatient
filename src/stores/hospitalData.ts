import { reactive } from "vue";
import {
  getDepartmentRegistrations,
  getClinicRegistrations,
  getDoctorRegistrations,
} from "@/api/patient/registrations";
import { defineStore } from "pinia";
import {
  createDepartRegistration,
  createClinicRegistration,
  createDoctorRegistration,
} from "@/api/admin/registrations";
import type {
  getDepartment,
  getClinic,
  department,
  clinic,
  doctor,
} from "@/api/patient/registrations";

export const useHospitalStore = defineStore("hospital", () => {
  const departs: department[] = reactive([]);
  const clinics: clinic[] = reactive([]);
  const doctors = reactive<doctor[]>([]);

  // 获取列表
  const getDepartments = async () => {
    const newDepartments = await getDepartmentRegistrations();
    Object.assign(departs, newDepartments);
  };

  const getClinics = async (departmentId: number) => {
    const newClinics = await getClinicRegistrations(departmentId);
    Object.assign(clinics, newClinics);
  };

  const getDoctors = async (departmentId: number, clinicId: number) => {
    const newDoctors = await getDoctorRegistrations(departmentId, clinicId);
    Object.assign(doctors, newDoctors);
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

  // 医生相关操作
  const createDoctor = async (
    clinicId: number,
    name: string,
    title: string,
    introduction: string
  ) => {
    const getDoctor: doctor = await createDoctorRegistration(clinicId, name, title, introduction);
    doctors.push(getDoctor);
  };

  return {
    departs,
    clinics,
    doctors,
    getDepartments,
    getClinics,
    getDoctors,
    createDepart,
    createClinic,
    createDoctor,
  };
});
