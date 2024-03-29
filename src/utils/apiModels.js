export const ServiceModel = {
  id: Number,
  name: String,
  type: Object,
  rps: {
    type: Number,
    optional: true,
  },
  dps: {
    type: Number,
    optional: true,
  },
  mem: {
    type: Number,
    optional: true,
  },
  cost: Number,
}
export const NodeModel = {
  id: Number,
  name: String,
  services: {
    type: Array,
    item: {
      type: Object,
      fields: ServiceModel,
    },
  },
  location: {
    type: Object,
    fields: {
      x: Number,
      y: Number,
    }
  },
  linkedTo: {
    type: Array,
    item: Number,
  }
}
export const NodesModel = {
  nodes: {
    type: Array,
    item: {
      type: Object,
      fields: NodeModel,
    },
  }
}
