<template>
<span :title="timestamp | userFriendlyDate">{{timestamp | diffDate}}</span>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    timestamp: {
      type: Number,
      required: true
    }
  },
  filters: {
    userFriendlyDate (date) {
      return moment.unix(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    diffDate (date) {
      return moment.unix(date).fromNow()
    }
  }
}
</script>
