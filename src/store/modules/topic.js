import axios from 'axios';
import { defineStore } from 'pinia';

export const useTopicStore = defineStore({
    id: 'topic',
    state: () => ({
        topics : [],
        loading: false,
        error: null,
        current_page: 0,
    }),
    getters: {
        getTopics: (state) => {    
            
            const topics =[];
            state.topics.forEach((v, index) => {
                v.isOpened = false;
                topics.push(v);
            });

            return topics;
        },
        getPaginatedTopics: (state) => {

            const topics = state.topics;

            return topics.slice(state.current_page, state.current_page+20);

        },
        getTopicsCount: (state) => {    
            return state.topics.length;
        },
    },
    actions: {
        async fetchTopics() {
            this.topics = [];
            this.loading = true;
            try {
                this.topics = await axios.get('https://atillc.blob.core.windows.net/data-collector/icode/test-data/topics.json')
                .then((response) => response.data.topics) 
            } catch (error) {
                this.error = error
            } finally {
                this.loading = false
            }

        },
        generateRandomString: (length) => {
            let result = '';
            const characters =
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
              result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
        deleteTopic(data) {
            this.topics.splice(data, 1);
        },
        editTopic(data, guid) {

            const index = this.topics.findIndex(object => {
                return object.guid === guid;
            });

            this.topics[index].name = data;
        },
        createTopic(topic_name) {

            const guid = this.generateRandomString(8);

            let data = {
                name: topic_name,
                guid: guid,
                comments: [],
            }

            this.topics.unshift(data);
        },
        changePage(page) {

            const selected_page = (page == 1) ? 0 : page;
            
            this.current_page = selected_page * 10;
        },
    }
  })