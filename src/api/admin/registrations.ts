import { DoAxiosWithErro } from "..";
//科室相关操作
export const createDepartRegistration = async (deptName: string) => {
  try {
    const res = await DoAxiosWithErro("/admin/department", "post", { deptName }, true, true);

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updeteDepartRegistration = async (deptId: number, updetedDepartName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/admin/department",
      "put",
      { deptId, deptName: updetedDepartName },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const deleteDepartRegistration = async (deptId: number) => {
  try {
    const res = await DoAxiosWithErro(`/admin/department/${deptId}`, "delete", {}, true, false);

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 门诊相关操作
export const createClinicRegistration = async (deptId: number, clinicName: string) => {
  try {
    const res = await DoAxiosWithErro("/admin/clinic", "post", { deptId, clinicName }, true, true);
    return res;
  } catch (err) {
    console.error(err);
  }
};

export const updeteClinicRegistration = async (clinicId: number, updetedClinicName: string) => {
  try {
    const res = await DoAxiosWithErro(
      "/admin/clinic",
      "put",
      { clinicId, clinicName: updetedClinicName },
      true,
      true
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

export const deleteClinicRegistration = async (clinicId: number) => {
  try {
    const res = await DoAxiosWithErro(`/admin/clinic/${clinicId}`, "delete", {}, true, false);

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
  clinicId: number,
  name: string,
  title: string,
  introduction: string,
  avatarFile: File
) => {
  try {
    const formData = new FormData();

    // 添加JSON数据部分
    formData.append(
      "doctorInfo",
      JSON.stringify({
        username,
        password,
        email,
        phone,
        clinicId,
        name,
        title,
        introduction,
      })
    );

    // 单独添加文件部分
    formData.append("avatarFile", avatarFile);

    const res = await DoAxiosWithErro(
      "/admin/doctor",
      "post",
      formData,
      true,
      true // 或让Axios自动处理
    );

    return res;
  } catch (err) {
    console.error(err);
    throw err; // 重新抛出错误以便调用者处理
  }
};

export const updateDoctorRegistration = async (
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
  avatarFile: File
) => {
  try {
    const formData = new FormData();

    // 添加JSON数据部分
    formData.append(
      "doctorInfo",
      JSON.stringify({
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
      })
    );

    // 单独添加文件部分
    formData.append("avatarFile", avatarFile);

    const res = await DoAxiosWithErro(
      "/admin/doctor",
      "put",
      formData,
      true,
      true // 或让Axios自动处理
    );

    return res;
  } catch (err) {
    console.error(err);
    throw err; // 重新抛出错误以便调用者处理
  }
};

// export const createDoctorRegistration = async (
//   username: string,
//   password: string,
//   email: string,
//   phone: string,
//   clinicId: number,
//   name: string,
//   title: string,
//   introduction: string,
//   avatarFile: File
// ) => {
//   try {
//     // 这里使用 FormData 来处理文件上传
//     // 创建 FormData 对象并添加参数
//     const formData = new FormData();
//     const doctorInfo = {
//       username,
//       password,
//       email,
//       phone,
//       clinicId,
//       name,
//       title,
//       introduction,
//       avatarFile,
//     };
//     // 更替为二进制文件符合 form-data 形式
//     formData.append(
//       "doctorInfo",
//       new Blob([JSON.stringify(doctorInfo)], {
//         type: "application/json",
//       })
//     );

//     const res = await DoAxiosWithErro(
//       "/admin/doctor",
//       "post",
//       formData, // 直接传递 FormData 对象
//       true,
//       true
//     );

//     return res;
//   } catch (err) {
//     console.error(err);
//   }
// };

// export const updateDoctorRegistration = async (
//   doctorId: number,
//   userId: number,
//   username: string,
//   password: string,
//   email: string,
//   phone: string,
//   clinicId: number,
//   name: string,
//   title: string,
//   introduction: string,
//   avatarFile: File
// ) => {
//   try {
//     // 这里使用 FormData 来处理文件上传
//     // 创建 FormData 对象并添加参数
//     const formData = new FormData();
//     const doctorInfo = {
//       doctorId,
//       userId,
//       username,
//       password,
//       email,
//       phone,
//       clinicId,
//       name,
//       title,
//       introduction,
//       avatarFile,
//     };
//     // 更替为二进制文件符合 form-data 形式
//     formData.append(
//       "doctorInfo",
//       new Blob([JSON.stringify(doctorInfo)], {
//         type: "application/json",
//       })
//     );

//     const res = await DoAxiosWithErro(
//       "/admin/doctor",
//       "put",
//       formData, // 直接传递 FormData 对象
//       true,
//       true
//     );

//     return res;
//   } catch (err) {
//     console.error(err);
//   }
// };

export const deleteDoctorRegistration = async (doctorId: number) => {
  try {
    const res = await DoAxiosWithErro(
      `/admin/doctor/${doctorId}`,
      "delete",
      { doctorId }, // 直接传递 FormData 对象
      true,
      false
    );

    return res;
  } catch (err) {
    console.error(err);
  }
};

// 排班相关操作
export const createScheduleRegistration = async (
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
  try {
    const res = await DoAxiosWithErro(
      "/admin/schedule",
      "post",
      { doctorId, clinicId, scheduleDate, timeSlot, maxPatients, currentPatients, status },
      true,
      true
    );
    const newSchedule = {
      // 响应结果提取部分
      scheduleId: res.scheduleId,
      doctorId: res.doctorId,
      clinicId: res.clinicId,
      scheduleDate: res.scheduleDate,
      timeSlot: res.timeSlot,
      remainingQuota: res.maxPatients - res.currentPatients,
      canBook: res.maxPatients - res.currentPatients > 0 ? true : false,
      // 请求提供部分
      doctorName: doctorName,
      doctorTitle: doctorTitle,
      doctorIntroduction: doctorIntroduction,
      doctorAvatar: doctorAvatar,
    };
    return newSchedule;
  } catch (err) {
    console.error(err);
  }
};

export const updateScheduleRegistration = async (
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
  try {
    const res = await DoAxiosWithErro(
      "/admin/schedule",
      "put",
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
    const newSchedule = {
      scheduleId: res.scheduleId,
      doctorId: res.doctorId,
      clinicId: res.clinicId,
      scheduleDate: res.scheduleDate,
      timeSlot: res.timeSlot,
      remainingQuota: res.maxPatients - res.currentPatients,
      canBook: res.maxPatients - res.currentPatients > 0 ? true : false,
      // 请求提供部分
      doctorName: doctorName,
      doctorTitle: doctorTitle,
      doctorIntroduction: doctorIntroduction,
      doctorAvatar: doctorAvatar,
    };
    return newSchedule;
  } catch (err) {
    console.error(err);
  }
};

export const deleteScheduleRegistration = async (scheduleId: number) => {
  try {
    const res = await DoAxiosWithErro(
      `/admin/schedule/${scheduleId}`,
      "delete",
      {
        scheduleId,
      },
      true,
      false
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
  clinicId?: number
) => {
  try {
    // 通过 Axios 的 params 传递 Query 参数，保持 POST 方法
    if (clinicId) {
      const res = await DoAxiosWithErro(
        `/admin/schedule/auto?startDate=${startDate}&endDate=${endDate}&clinicId=${clinicId}`,
        "post",
        {},
        true,
        false
      );
      return res;
    } else {
      const res = await DoAxiosWithErro(
        `/admin/schedule/auto?startDate=${startDate}&endDate=${endDate}`,
        "post",
        {},
        true,
        false
      );
      return res;
    }
  } catch (err) {
    console.error("自动更新排班失败:", err);
    throw err; // 可选：向上抛出错误以便上层处理
  }
};
