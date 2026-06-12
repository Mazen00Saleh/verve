<script setup lang="ts">
const route = useRoute()

await navigateTo({
  path: '/inspiration',
  query: route.query,
}, { redirectCode: 301 })
</script>
