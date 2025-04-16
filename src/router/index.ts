import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/patient",
      name: "patient",
      component: () => import("../views/PatiEnt.vue"),
      children: [
        {
          path: "",
          name: "medicalAp",
          component: () => import("../views/patient/MedicalAp.vue"),
          children: [
            {
              path: "",
              name: "department",
              component: () => import("@/components/Registrations/DepartmentCard.vue"),
            },
            {
              path: ":department/:clinic",
              name: "clinic",
              component: () => import("@/components/Registrations/ClinicCard.vue"),
            },
            {
              path: ":department/:clinic/:doctor",
              name: "doctor",
              component: () => import("@/components/Registrations/Doctor.vue"),
            },
          ],
        },
        {
          path: "chat",
          name: "chat",
          component: () => import("../views/ChatView.vue"),
        },
        {
          path: "callback",
          name: "callback",
          component: () => import("../views/patient/PatientCB.vue"),
        },
        {
          path: "myinfo",
          name: "myinfo",
          component: () => import("../views/patient/Myinfo.vue"),
        },
        {
          path: "card",
          name: "card",
          component: () => import("../views/CardView.vue"),
        },
      ],
    },
    {
      path: "/doctor",
      name: "doctor",
      component: () => import("../views/DocTor.vue"),
      children: [
        {
          path: "",
          name: "outpatient",
          component: () => import("../views/doctor/OutPatient.vue"),
          children: [
            {
              path: "",
              name: "allRegistrations",
              component: () => import("@/components/Registrations/AllRegistrations.vue"),
            },
            {
              path: ":id",
              name: "detailRegistrations",
              component: () => import("@/components/Registrations/DetailRegistrations.vue"),
            },
          ],
        },
        {
          path: "docotorcallback",
          name: "docotorcallback",
          component: () => import("../views/doctor/DoctorBC.vue"),
        },
        {
          path: "datapre",
          name: "datapre",
          component: () => import("../views/doctor/DataPre.vue"),
        },
      ],
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdMin.vue"),
      children: [
        {
          path: "",
          name: "crud",
          component: () => import("../views/admin/CRUD.vue"),
        },
        {
          path: "shedule",
          name: "shedule",
          component: () => import("../views/admin/SheduleVue.vue"),
        },
      ],
    },
  ],
});

export default router;
