import { defineStore } from "pinia";

import { reactive, ref } from "vue";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { DoAxiosWithErro } from "@/api";

export const useComunicationStore = defineStore("comunication", () => {
  const sockt = ref<any>(null);
  const stompClient = ref<any1>(null);
  const isConnected = ref<boolean>(false);

  const messagemMap = reactive(new Map<number, any>());
  const digList = reactive([]);
  const unreadCounters = reactive({});

  const getDiagnosticos = async (doctorId: number, patientId: number) => {
    if (!doctorId && !patientId) return;
    if (doctorId) {
      const res = await DoAxiosWithErro(
        "/medical/doctor/diagnoses-list",
        "get",
        { doctorId },
        true,
        false
      );
      digList.splice(0, digList.length);
      digList.push(...res);
      return;
    }
    if (patientId) {
      const res = await DoAxiosWithErro(
        "/medical/patient/diagnoses-list",
        "get",
        { patientId },
        true,
        false
      );
      digList.splice(0, digList.length);
      digList.push(...res);
    }
  };

  const getHistory = async (diagId: number) => {
    return await DoAxiosWithErro("/medical/get-feedback-diagnoses", "post", { diagId }, true, true);
  };

  const initMessageMap = async (doctorId: number, patientId: number) => {
    await getDiagnosticos(doctorId, patientId);

    for (let i = 0; i < digList.length; i++) {
      const res = await getHistory(digList[i].diagId);
      messagemMap.set(digList[i].diagId, res);
    }
  };

  const pushMessage = (diagId: number, message: any) => {
    if (messagemMap.has(diagId)) {
      messagemMap.get(diagId).push(message);
    } else {
      messagemMap.set(diagId, [message]);
    }
  };

  const getunreadCounters = () => {
    DoAxiosWithErro("/medical/feedback/unread/counts", "get", {}, true).then((res) => {
      Object.assign(unreadCounters, res);
      console.log("unreadCounters", unreadCounters);
    });
  };

  const init = async (userToken: string, doctorId: number, patientId: number) => {
    await initMessageMap(doctorId, patientId);

    getunreadCounters();

    sockt.value = new SockJS("/ws");
    stompClient.value = new Client({ webSocketFactory: () => sockt.value });
    stompClient.value.connectHeaders = {
      satoken: userToken,
    };
    stompClient.value.onConnect = () => {
      isConnected.value = true;
      console.log("conectado", stompClient.value);
      stompClient.value.subscribe("/user/queue/feedback", (message) => {
        const body = JSON.parse(message.body);
        if (body.type === "message") {
          const message = body.message;
          const newMseeage = {
            ...message,
            diagId: message.chatId,
            messageId: message.id,
          };
          pushMessage(body.message.chatId, newMseeage);
          console.log("message", messagemMap);
        } else if (body.type === "unread_counter") {
          Object.assign(unreadCounters, body.counters);
        }
        console.log("body", body);
        // pushMessage(body.diagId, body);
      });
    };
    stompClient.value.onStompError = (error) => {
      console.log(error);
      isConnected.value = false;
    };
    stompClient.value.activate();
  };

  const subscribe = (callback: any) => {
    if (stompClient.value && isConnected.value) {
      stompClient.value.subscribe("/user/queue/feedback", callback);
    }
  };

  return {
    init,
    subscribe,
    messagemMap,
    digList,
    getDiagnosticos,
    getHistory,
    initMessageMap,
    isConnected,
    sockt,
    stompClient,
    getunreadCounters,
    unreadCounters,
  };
});
