import { defineStore } from "pinia";
import { reactive, ref } from "vue";

interface ChatHistory {
    sender: 'ai' | 'user';
    text: string;
}

interface SessionIdObj {
    time: number;
    id: string;
}


export const useChatHistoryStore = defineStore("chatHistory", () =>{

    const sessionIdMap = reactive(new Map())

    const addId = (appoimentId: number, sessionId: string) => {
        const newId = {
            sessionId,
            time: new Date().getTime()
        }
        sessionIdMap.set(appoimentId,newId);
    }


    const getId = (appoimentId : number) => {
        const idObj = sessionIdMap.get(appoimentId);
        if(!idObj) {
            return ''
        }
        if(idObj.time - new Date().getTime() > 60 * 60 * 1000 ){
            sessionIdMap.delete(appoimentId)
            return ''
        }

        idObj.time = new Date().getTime();

        return idObj.sessionId;
    }

    return {
        sessionIdMap,
        addId,
        getId   
    }

})