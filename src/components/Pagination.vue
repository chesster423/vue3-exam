<script setup>
defineProps({
  pages: Number,
  currentPage: Number,
})

const emit = defineEmits(["clicked"]);

function changePage(val) {
    emit('clicked', val);
}

function getCurrentPage(page){
    if(page === 0) {
        return 1;
    }

    return page/10;
}


</script>
<template>
    <div>
        <div class="pagination">
            <a href="#" v-for="index in Math.ceil(pages/20)" @click="changePage(index)" :class="{'active' : getCurrentPage(currentPage) === index}">{{ index }}
            </a>
        </div>
    </div>
</template>

<style>
.pagination {
  display: inline-block;
}

.pagination a {
  color: #fff;
  float: left;
  padding: 8px 16px;
  text-decoration: none;
}

.active {
    font-weight: bold;
    background-color: #2ebd71;
}
</style>

