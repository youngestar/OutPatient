import { number } from "echarts";
import { DoAxiosWithErro } from "..";
export interface Registration {
  doctorId: number;
  appointmentId: number;
  scheduleId: string;
  patientName: string;
  isRevisit: number;
  status: number;
  description: string;
  appointmentDate: string;
  deptName: string;
  clinicName: string;
  doctorName: string;
  statusDesc: string;
}

export interface detailRegistration extends Registration {
  aiConsultSessionId: string;
}
export const doctorGetRegistrations = async (doctorId: number) => {
  try {
    const res = await DoAxiosWithErro(
      `/api/appointment/doctor/${doctorId}`,
      "get",
      {},
      true,
      false
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const doctorGetDetailRegistration = async (doctorId: number, appointmentId: number) => {
  try {
    const res = await DoAxiosWithErro(
      `/api/appointment/doctor/${doctorId}/appointment/${appointmentId}`,
      "get",
      {},
      true,
      false
    );
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
};
