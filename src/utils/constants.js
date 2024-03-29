export const ServicesTypes = {
  backend: {
    id: 1,
    name: 'Бэкенд',
    rps: 300,
    cost: 20,
  },
  database: {
    id: 2,
    name: 'База данных',
    rps: 600,
    dps: 600,
    cost: 20,
  },
  diskStorage: {
    id: 3,
    name: 'Дисковое хранилище',
    dps: 2000,
    cost: 10
  },
  balancer: {
    id: 4,
    name: 'Балансировшик',
    rps: 2000,
    dps: 20,
    cost: 1,
  },
  CDN: {
    id: 5,
    name: 'CDN',
    radius: 10,
    cost: 5,
  },
}

export const CableTypes = {
  ethernet: {
    name: 'Витая пара',
    dps: 1000,
  },
  opticalFiber: {
    name: 'Оптоволокно',
    dps: 10000,
  },
}
export const nodesConfig = {
  nodes: [
    {
      id: 1,
      name: '1',
      services: [],
      location: {x: 15, y: 15},
      linkedTo: [],
    },
    {
      id: 2,
      name: '2',
      services: [],
      location: {x: 55, y: 25},
      linkedTo: [],
    },
    {
      id: 3,
      name: '3',
      services: [],
      location: {x: 85, y: 15},
      linkedTo: [],
    },

    {
      id: 4,
      name: '4',
      services: [],
      location: {x: 20, y: 45},
      linkedTo: [],
    },
    {
      id: 5,
      name: '5',
      services: [],
      location: {x: 45, y: 55},
      linkedTo: [],
    },
    {
      id: 6,
      name: '6',
      services: [],
      location: {x: 80, y: 45},
      linkedTo: [],
    },

    {
      id: 7,
      name: '7',
      services: [],
      location: {x: 15, y: 75},
      linkedTo: [],
    },
    {
      id: 8,
      name: '8',
      services: [],
      location: {x: 55, y: 85},
      linkedTo: [],
    },
    {
      id: 9,
      name: '9',
      services: [],
      location: {x: 85, y: 75},
      linkedTo: [],
    },
  ]
}
