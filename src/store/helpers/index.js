import Vue from 'vue'

const appendChildToParentMutation = ({ parent, child }) => (state, { parentId, childId }) => {
  const resource = state.items[parentId]
  if (!resource[child]) {
    Vue.set(resource, child, {})
  }
  Vue.set(resource[child], childId, childId)
}

export { appendChildToParentMutation }
