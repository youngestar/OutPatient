import { number } from "echarts";
import { DoAxiosWithErro } from "..";
export interface Registration {
  doctorId: number;
  appointmentId: number;
  scheduleId: string;
  patientName: string;
  patientId: number;
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

// 获取挂号信息
export const doctorGetRegistrations = async (doctorId: number) => {
  try {
    const res = await DoAxiosWithErro(`/appointment/doctor/${doctorId}`, "get", {}, true, false);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const doctorGetDetailRegistration = async (doctorId: number, appointmentId: number) => {
  try {
    const res = await DoAxiosWithErro(
      `/appointment/doctor/${doctorId}/appointment/${appointmentId}`,
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

// 操作挂号
export const creatRegistrationDiagnoses = async (
  appointmentId: number,
  doctorId: number,
  patientId: number,
  diagnosisResult: string,
  examination: string,
  prescription: string,
  advice: string
) => {
  try {
    const res = await DoAxiosWithErro(
      "/medical/diagnoses",
      "post",
      {
        appointmentId,
        doctorId,
        patientId,
        diagnosisResult,
        examination,
        prescription,
        advice,
      },
      true,
      true
    );
    return res;
  } catch (err) {
    console.error(err);
  }
};
