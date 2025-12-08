import { defineStore } from "pinia";
import { reactive } from "vue";

interface SessionIdObj {
  time: number;
  sessionId: string;
}

export const useChatHistoryStore = defineStore("chatHistory", () => {
  const sessionIdMap = reactive(new Map<number, SessionIdObj>());

  const addId = (appoimentId: number, sessionId: string) => {
    const newId: SessionIdObj = {
      sessionId,
      time: new Date().getTime(),
    };
    sessionIdMap.set(appoimentId, newId);
  };

  const getId = (appoimentId: number) => {
    const idObj = sessionIdMap.get(appoimentId);
    if (!idObj) {
      return "";
    }
    if (idObj.time - new Date().getTime() > 60 * 60 * 1000) {
      sessionIdMap.delete(appoimentId);
      return "";
    }

    idObj.time = new Date().getTime();

    return idObj.sessionId;
  };

  return {
    sessionIdMap,
    addId,
    getId,
  };
});
