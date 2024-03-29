export const ServicesTypes = {
  backend: 'backend',
  database: 'database',
  diskStorage: 'diskStorage',
  balancer: 'balancer',
  CDN: 'CDN',
  monitoring: 'monitoring',
  backWithFront: 'backWithFront',
}
export const ServicesConfigs = [
  {
    id: 1,
    name: 'Бэкенд',
    rps: -300,
    dps: +500,
    cost: 15000,
    type: ServicesTypes.backend,
  },
  {
    id: 2,
    name: 'База данных',
    dps: -1200,
    mem: +8,
    cost: 15000,
    type: ServicesTypes.database,
  },
  {
    id: 3,
    name: 'Дисковое хранилище',
    mem: -14,
    cost: 20000,
    type: ServicesTypes.diskStorage,
  },
  {
    id: 4,
    name: 'Балансировщик',
    cost: 10000,
    type: ServicesTypes.balancer,
  },
  {
    id: 5,
    name: 'CDN',
    rps: +400,
    dps: +200,
    cost: 5000,
    type: ServicesTypes.CDN,
  },
  {
    id: 6,
    name: 'Мониторинг',
    cost: 2000,
    mem: +1,
    type: ServicesTypes.monitoring,
  },
  {
    id: 7,
    name: 'Бэкенд с раздачей фронта',
    cost: 10000,
    dps: +300,
    rps: 100,
    type: ServicesTypes.backWithFront,
  },
]

export const CableTypes = {
  ethernet: {
    name: 'Витая пара',
    dps: 1000,
    cost: 5000,
  },
  opticalFiber: {
    name: 'Оптоволокно',
    dps: 10000,
    cost: 20000,
  },
}
export const defaultNodesConfig = {
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
