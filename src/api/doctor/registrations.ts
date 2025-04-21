import { DoAxiosWithErro } from "..";
export interface Registration {
  num: number;
  name: string;
  gender: string;
  age: number;
  id: string;
  description: string;
  registerTime: string;
  department: string;
  clinicRoom: string;
  state: string;
  note: string;
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
    console.log(res);
    return res;
  } catch (err) {
    console.error(err);
  }
};
