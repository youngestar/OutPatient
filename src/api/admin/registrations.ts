import { DoAxiosWithErro } from "..";

export const getDepartmentRegistrations = async () => {
  try {
    const res = await DoAxiosWithErro(
      `/api/appointment/departments?onlyActive=true`,
      "get",
      {},
      true,
      false
    );

    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

export const updeteDepartRegistration = async (updetedDepartName) => {
  try {
    const res = await DoAxiosWithErro(
      "/api/admin/department",
      "put",
      { deptName: updetedDepartName },
      true,
      true
    );

    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

export const updeteClinicRegistration = async () => {};
