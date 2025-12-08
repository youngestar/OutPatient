import { defineStore } from "pinia";

import { reactive, ref } from "vue";
import { Client, type IMessage, type IStompSocket } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { DoAxiosWithErro } from "@/api";

export const useComunicationStore = defineStore("comunication", () => {
  interface FeedbackMessage {
    content: string;
    senderType: number;
    [key: string]: unknown;
  }

  interface DiagnoseSummary {
    diagId: string;
    [key: string]: unknown;
  }

  const sockt = ref<IStompSocket | null>(null);
  const stompClient = ref<Client | null>(null);
  const isConnected = ref<boolean>(false);

  const messagemMap = reactive(new Map<string, FeedbackMessage[]>());
  const digList = reactive<DiagnoseSummary[]>([]);
  const unreadCounters = reactive<Record<string, number>>({});

  const getDiagnosticos = async (doctorId: string, patientId: string) => {
    if (!doctorId && !patientId) return;
    if (doctorId) {
      const res = await DoAxiosWithErro<DiagnoseSummary[]>(
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
      const res = await DoAxiosWithErro<DiagnoseSummary[]>(
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

  const getHistory = async (diagId: string): Promise<FeedbackMessage[]> => {
    return await DoAxiosWithErro<FeedbackMessage[]>(
      "/medical/get-feedback-diagnoses",
      "post",
      { diagId },
      true,
      true
    );
  };

  const initMessageMap = async (doctorId: string, patientId: string) => {
    await getDiagnosticos(doctorId, patientId);

    for (let i = 0; i < digList.length; i++) {
      const res = await getHistory(digList[i].diagId);
      messagemMap.set(digList[i].diagId, res);
    }
  };

  const pushMessage = (diagId: string, message: FeedbackMessage) => {
    const existing = messagemMap.get(diagId) ?? [];
    existing.push(message);
    messagemMap.set(diagId, existing);
  };

  const getunreadCounters = () => {
    DoAxiosWithErro<Record<string, number>>(
      "/medical/feedback/unread/counts",
      "get",
      {},
      true
    ).then((res) => {
      Object.assign(unreadCounters, res);
      console.log("unreadCounters", unreadCounters);
    });
  };

  const init = async (userToken: string, doctorId: string, patientId: string) => {
    await initMessageMap(doctorId, patientId);

    getunreadCounters();

    sockt.value = new SockJS("/ws");
    stompClient.value = new Client({ webSocketFactory: () => sockt.value as IStompSocket });
    stompClient.value.connectHeaders = {
      satoken: userToken,
    };
    stompClient.value.onConnect = () => {
      isConnected.value = true;
      console.log("conectado", stompClient.value);
      stompClient.value?.subscribe("/user/queue/feedback", (message: IMessage) => {
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

  const subscribe = (callback: (message: IMessage) => void) => {
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
