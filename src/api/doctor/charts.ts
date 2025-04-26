import { DoAxiosWithErro } from "..";

// 患者年龄分布
export const getChartsDataAge = async () => {
  try {
    const res = await DoAxiosWithErro(
      "/api/data-analysis/patient-age-distribution",
      "get",
      {},
      true,
      false
    );
    const keys = Object.keys(res);
    const values = Object.values(res);
    const options = [];
    for (let i = 0; i < keys.length; i++) {
      options.push({
        value: values[i],
        name: keys[i],
      });
    }
    return options;
  } catch (err) {
    console.error(err);
  }
};

// 医生工作量统计
export const getChartsDataDoctor = async () => {
  try {
    const res = await DoAxiosWithErro("/api/data-analysis/doctor-workload", "get", {}, true, false);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

// 患者就诊频率统计
export const getChartsDataFrequency = async () => {
  try {
    const res = await DoAxiosWithErro(
      "/api/data-analysis/patient-visit-frequency",
      "get",
      {},
      true,
      false
    );
    const keys = Object.keys(res);
    const values = Object.values(res);
    return {
      keys,
      values,
    };
  } catch (err) {
    console.error(err);
  }
};

// 患者性别分布
export const getChartsDataGender = async () => {
  try {
    const res = await DoAxiosWithErro(
      "/api/data-analysis/patient-gender-ratio",
      "get",
      {},
      true,
      false
    );
    const keys = Object.keys(res);
    const values = Object.values(res);
    return {
      keys,
      values,
    };
  } catch (err) {
    console.error(err);
  }
};

// async login(userData: { username: string; password: string }) {
//     try {
//       const res = await DoAxiosWithErro('/api/auth/login', 'post', userData, false);
//       const info: UserInfo = res.data;

//       this.userToken = info.token!;
//       this.userInfo = info;
//       this.isLoggedIn = true;

//       // 持久化
//       localStorage.setItem('userToken', this.userToken);
//       localStorage.setItem('userInfo', JSON.stringify(info));
//     } catch (err) {
//       this.logout(); // 失败时清空状态
//       throw err;
//     }
//   },
