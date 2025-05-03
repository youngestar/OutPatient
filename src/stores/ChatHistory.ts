import { defineStore } from "pinia";
import { ref } from "vue";

interface ChatHistory {
    sender: 'ai' | 'user';
    text: string;
}

interface SessionIdObj {
    time: number;
    id: string;
}


export const useChatHistoryStore = defineStore("chatHistory", () =>{
    const sessionId = ref(localStorage.getItem('sessionId')?.id as string || '');

    const saveSessionId = (id: string) => {
        if (!id) return;
        sessionId.value = id;
        const idObj = {time: Date.now(), id};
        const idObjString = JSON.stringify(idObj);
        localStorage.setItem('sessionId', idObjString);
    }

    const getSessionId = () => {
        const idObjString = localStorage.getItem('sessionId');
        console.log(idObjString);
        if (idObjString) {
            const idObj = JSON.parse(idObjString) as SessionIdObj;
            if (Date.now() - idObj.time > 1000 * 60 * 60) { // 1 day
                return '';
            }
            return idObj.id;
        }
    }

    const updateTime = () => {
        const idObjString = localStorage.getItem('sessionId');
        if (idObjString) {
            const idObj = JSON.parse(idObjString) as SessionIdObj;
            idObj.time = Date.now();
            localStorage.setItem('sessionId', JSON.stringify(idObj));
        }
    }

    return {
        sessionId,
        getSessionId,
        updateTime,
        saveSessionId
    }

})