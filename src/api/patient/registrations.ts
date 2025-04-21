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
