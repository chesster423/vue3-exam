<script setup>

import { onMounted } from 'vue'
import Pagination from './Pagination.vue'
import { storeToRefs } from 'pinia'
import { useTopicStore } from './../store/modules/topic'
import Swal from 'sweetalert2'

const { fetchTopics, deleteTopic, editTopic, createTopic, changePage } = useTopicStore()
const { topics, current_page, loading, error } = storeToRefs(useTopicStore())
const { getTopicsCount, getPaginatedTopics } = storeToRefs(useTopicStore())

onMounted(() => {
    fetchTopics();
})

function popDeleteTopic(key) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
    if (result.isConfirmed) {
        deleteTopic(key)
        Swal.fire(
            'Deleted!',
            'The topic has been deleted.',
            'success'
        )
    }
    })
}

function popEditTopic(guid) {
    Swal.fire({
    title: 'Edit topic name',
    input: 'text',
    inputAttributes: {
        autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true,
    preConfirm: (topic) => {
        return topic;
    },
    allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            editTopic(result.value, guid);
            Swal.fire(
                'Success!',
                'The topic has been updated.',
                'success'
            )
        }
    })
}

function popCreateTopic() {
    Swal.fire({
    title: 'Create new topic',
    input: 'text',
    inputAttributes: {
        autocapitalize: 'off'
    },
    showCancelButton: true,
    confirmButtonText: 'Save',
    showLoaderOnConfirm: true,
    preConfirm: (topic) => {
        return topic;
    },
    allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            createTopic(result.value);
            Swal.fire(
                'Success!',
                'New topic added.',
                'success'
            )
        }
    })
}

function onClickChild (value) {
    changePage(value);
}

</script>

<template>
  <div class="topics-container">

    <div class="grid grid-cols-2 mb-2">
        <h3 class="text-xl font-bold">
            Topics
        </h3>

        
        <button class="btn btn-blue w-fit ml-auto" @click="popCreateTopic()">Create Topic</button>
    </div>

    <p v-if="loading">Loading posts...</p>
    <p v-if="error">{{ error.message }}</p>

    <Pagination :pages="getTopicsCount" :current-page="current_page" @clicked="onClickChild"></Pagination>
    <div class="relative overflow-x-auto" v-if="topics">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" class="px-6 py-3">
                        Name
                    </th>
                    <th scope="col" class="px-6 py-3">
                        GUID
                    </th>
                    <th scope="col" class="px-6 py-3">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800" v-for="(val, key) in getPaginatedTopics" v-bind:key="key">

                <tr class="border-y-2">
                    <th class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <label class="text-md font-bold">{{ val.name }}</label>
                    </th>
                    <td class="px-6 py-4">
                        {{ val.guid }}
                    </td>
                    <td class="px-6 py-4">
                        <a class="cursor-pointer mr-5" v-on:click="val.isOpened = !val.isOpened" v-if="val.comments.length">View comments</a>
                        <span class="text-slate-600 cursor-default mr-30" v-if="!val.comments.length">No comments</span>
                        <a class="cursor-pointer mr-5" @click="popDeleteTopic(key)">Delete</a>
                        <a class="cursor-pointer" @click="popEditTopic(val.guid)">Edit</a>
                    </td>            
                </tr>
                <tr>
                    <td colspan="3" v-if="val.isOpened">
                        <div class="text-gray">
                            <div v-for="(v, k) in val.comments" class="pl-5  py-5">
                                <span class="text-cyan-600">@{{ v.by }}</span>
                                <p class="text-slate-400 whitespace-break-spaces">{{ v.comment }}</p> 
                                <i class="text-slate-600">{{ v.date }}</i>
                            </div>
                        </div>
                    </td>
                </tr>
                    
            </tbody>
        </table>
    </div>
    <Pagination :pages="getTopicsCount" :current-page="current_page" @clicked="onClickChild"></Pagination>
  </div>
</template>

<style scoped>
.mr-30 {
    margin-right: 30px;
}

.btn {
    @apply font-bold py-2 px-4 rounded;
  }
  .btn-blue {
    @apply bg-blue-500 text-white;
  }
  .btn-blue:hover {
    @apply bg-blue-700;
  }
</style>
