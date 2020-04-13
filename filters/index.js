import Vue from 'vue'

Vue.filter('toFixed2', (num) => {
    return parseFloat(num).toFixed(2)
})