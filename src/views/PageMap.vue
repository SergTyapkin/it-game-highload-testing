<style scoped lang="stylus">
@require '../styles/constants.styl'
@require '../styles/buttons.styl'
@require '../styles/utils.styl'
@require '../styles/fonts.styl'

.root-page
  width 100%
  height 100%
  .draggable-component
    hedth 100%
    height 100%
    .map
      width 2000px
      height 2000px
      background colorBg2
      .main-info
        border 1px solid colorBg10
        border-radius borderRadiusL
        padding 10px
        overflow visible
        font-small()
        .header
          text-align center
          font-medium()
          margin-bottom 3px
        .button-submit
          button()
      .node-container
        .node
          font-small()
          overflow visible
          width = 220px
          height = 550px
          border 1px solid colorBg10
          border-radius borderRadiusL
          padding 10px
          background colorBg3
          width width
          height height
          transform translate(- width / 2, - height / 2)
          position relative
          .name
            text-align center
            font-large()
            margin-bottom 10px
          .stats
          .services
          .links
            margin-bottom 20px
            .header
              text-align center
            .one-item
              border solid 1px colorBg10
              border-radius borderRadiusS
              padding 5px
              margin-bottom 5px
              display flex
              justify-content space-between
              align-items center
              .cost
                flex 1
                text-align right
                white-space nowrap
              mark
                color colorText5
                margin-left 3px
                background none
              img
                width 20px
                cursor pointer
            .buttons-container
              display flex
            .button-add
              button()
            .button-save
              button-success()
            .button-cancel
              button-danger()
          .stats
            .one-item
              flex-direction column
              align-items flex-start
              font-small-x()
              font-family monospace
              .warning
                color colorError
          .background-rps
          .background-dps
          .background-mem
            position absolute
            opacity 10%
            inset 0
            height 33%
            z-index -1
          .background-rps
            top 0
          .background-dps
            top 33%
          .background-mem
            top 66%
          &.rps-gen .background-rps
              background colorAlert
          &.rps-out .background-rps
              background colorError
          &.rps-in .background-rps
              background colorSuccess
          &.dps-gen .background-dps
              background colorAlert
          &.dps-out .background-dps
              background colorError
          &.dps-in .background-dps
              background colorSuccess
          &.mem-gen .background-mem
              background colorAlert
          &.mem-out .background-mem
              background colorError
          &.mem-in .background-mem
              background colorSuccess
      .links-container
        .links
          .link-start
          .link
            stroke colorEmp2
            stroke-width 2px
            stroke-dasharray 10 10
            &.first
              stroke lightblue
              transform translate(-10px, -10px)
            &.second
              stroke red
              transform translate(10px, 10px)
          .link-start
            stroke-width 5
            stroke-dasharray 300 99999999999
</style>

<template>
  <div class="root-page">
    <DraggableComponent ref="draggableEl"
                        unique-name="map"
                        class="draggable-component"
                        :max-x-offset="0"
                        :max-y-offset="0"
                        :min-x-offset="0"
                        :min-y-offset="0"
                        min-scale-full-size
                        :max-scale="3"
                        :inner-element-width="MAP_WIDTH"
                        :inner-element-height="MAP_HEIGHT"
                        no-reset-on-change-sizes
                        @click-clean="onClick"
    >
      <svg class="map" ref="map" :width="1" :height="1">
<!--        <rect @click="updateNodes" x="45%" y="5%" width="10%" height="5%" fill="red"></rect>-->
        <foreignObject x="40%" y="2%" width="20%" height="5%" class="main-info">
          <header class="header">Общая информация</header>
          <div class="info">На счету: {{Intl.NumberFormat().format(Math.ceil(totalMoney))}} $</div>
          <div class="info">Всего: {{Intl.NumberFormat().format(totalRequestsIn)}} RPS</div>
          <div class="info">Отрабатывает: {{Intl.NumberFormat().format(totalPercentOut * 100)}}% запросов
            = {{Intl.NumberFormat().format(totalRequestsIn * totalPercentOut)}} RPS
            = {{Intl.NumberFormat().format(totalRequestsIn * totalPercentOut / 100 * MONEY_PER_100RPS)}} $/sec
          </div>
        </foreignObject>
        <foreignObject x="40%" y="7%" width="20%" height="0" class="main-info">
          <button class="button-submit" @click="withdrawMoney">Зачислить на счет<img src="/res/icons/exchange.svg" alt="money"></button>
        </foreignObject>

        <g v-for="node in nodes" class="links-container">
          <g class="links">
            <line v-for="linkId in node.linkedTo"
                  class="link"
                  :x1="`${node.location.x}%`" :y1="`${node.location.y}%`"
                  :x2="`${getNode(linkId).location.x}%`" :y2="`${getNode(linkId).location.y}%`"
                  :class="{
                    'first': getNode(linkId).linkedTo.includes(node.id) && getNode(linkId).id > node.id,
                    'second': getNode(linkId).linkedTo.includes(node.id) && getNode(linkId).id <= node.id,
                  }"
            ></line>
            <line v-for="linkId in node.linkedTo"
                  class="link-start"
                  :x1="`${node.location.x}%`" :y1="`${node.location.y}%`"
                  :x2="`${getNode(linkId).location.x}%`" :y2="`${getNode(linkId).location.y}%`"
                  :class="{
                    'first': getNode(linkId).linkedTo.includes(node.id) && getNode(linkId).id > node.id,
                    'second': getNode(linkId).linkedTo.includes(node.id) && getNode(linkId).id <= node.id,
                  }"
            ></line>
          </g>
        </g>

        <g v-for="node in nodes" class="node-container">
          <foreignObject class="node"
                         width="1"
                         height="1"
                         :x="`${node.location.x}%`"
                         :y="`${node.location.y}%`"
                         :style="{
                           '--x': `${node.location.x}%`,
                           '--y': `${node.location.y}%`,
                         }"
                         :class="{
                           'rps-gen': node.totalRpsGen > 0,
                           'rps-out': node.totalRpsOut > node.totalRpsGen,
                           'rps-in': (node.totalRpsIn + node.totalRpsGen) > 0 && node.totalRpsOut <= 0,
                           'dps-gen': node.totalDpsGen > 0,
                           'dps-out': node.totalDpsOut > node.totalDpsGen,
                           'dps-in': (node.totalDpsIn + node.totalDpsGen) > 0 && node.totalDpsOut <= 0,
                           'mem-gen': node.totalMemGen > 0,
                           'mem-out': node.totalMemOut > node.totalMemGen,
                           'mem-in': (node.totalMemIn + node.totalMemGen) > 0 && node.totalMemOut <= 0,
                         }"
          >
            <div class="background-rps"></div>
            <div class="background-dps"></div>
            <div class="background-mem"></div>

            <header class="name">{{ node.name }}</header>

            <section class="stats">
              <header class="header">Статистика</header>
              <div class="one-item">
                <div v-if="node.totalRpsGen">RPS+ : {{ Intl.NumberFormat().format(node.totalRpsGen) }}</div>
                <div v-if="node.totalDpsGen">DPS+ : {{ Intl.NumberFormat().format(node.totalDpsGen) }}<mark>Mb/S</mark></div>
                <div v-if="node.totalMemGen">MEM+ : {{ Intl.NumberFormat().format(node.totalMemGen) }}<mark>Tb</mark></div>
                <div v-if="node.totalRpsIn">RPS →: {{ Intl.NumberFormat().format(node.totalRpsIn) }}</div>
                <div v-if="node.totalDpsIn">DPS →: {{ Intl.NumberFormat().format(node.totalDpsIn) }}<mark>Mb/S</mark></div>
                <div v-if="node.totalMemIn">MEM →: {{ Intl.NumberFormat().format(node.totalMemIn) }}<mark>Tb</mark></div>
                <div v-if="node.totalRpsOut" :class="{'warning': node.isEnding && node.totalRpsOut > 0}">← RPS: {{ Intl.NumberFormat().format(node.totalRpsOut) }}</div>
                <div v-if="node.totalDpsOut" :class="{'warning': node.isEnding && node.totalDpsOut > 0}">← DPS: {{ Intl.NumberFormat().format(node.totalDpsOut) }}<mark>Mb/S</mark></div>
                <div v-if="node.totalMemOut" :class="{'warning': node.isEnding && node.totalMemOut > 0}">← MEM: {{ Intl.NumberFormat().format(node.totalMemOut) }}<mark>Tb</mark></div>
                <div>Total: {{ Intl.NumberFormat().format(node.usersPercentOut * 100) }}<mark>%</mark></div>
              </div>
            </section>

            <section class="services">
              <header class="header">Сервисы</header>
              <div v-for="(service, serviceIdx) in node.services" class="one-item"><span>{{ service.name }}</span> <span class="cost">{{ service.cost * (String(service.type) === ServicesTypes.monitoring ? 1 : ((node.services.reduce((count, cur, idx) => count + ((String(cur.type) === ServicesTypes.monitoring || idx > serviceIdx) ? 0 : 1), 0)))) }} $</span><img src="/res/icons/trashbox.svg" alt="delete" @click="deleteServiceFromNode(node, serviceIdx)"></div>
              <button v-if="!node.addServiceInProcess" class="button-add" @click="node.addServiceInProcess = true"><img src="/res/icons/plus.svg" alt="plus">добавить сервис</button>
              <div v-if="node.addServiceInProcess">
                <DropdownList :list="ServicesConfigs" v-model="node.selectedServiceConfig" @input="(idx, el) => node.selectedServiceConfig = el"></DropdownList>
                <div class="buttons-container">
                  <button class="button-cancel" @click="node.addServiceInProcess = false"><img src="/res/icons/cross.svg" alt="cross">отменить</button>
                  <button class="button-save" @click="addServiceToNode(node, node.selectedServiceConfig); node.addServiceInProcess = false"><img src="/res/icons/save.svg" alt="plus">сохранить</button>
                </div>
              </div>
            </section>

            <section class="links">
              <header class="header">Связи</header>
              <div v-for="(link, linkIdx) in node.linkedTo" class="one-item">{{ link }}<img src="/res/icons/trashbox.svg" alt="delete" @click="deleteLinkFromNode(node, linkIdx)"></div>
              <button v-if="!node.addLinkInProcess" class="button-add" @click="node.addLinkInProcess = true"><img src="/res/icons/plus.svg" alt="plus">добавить связь</button>
              <div v-if="node.addLinkInProcess">
                <DropdownList :list="Object.values(nodes)" v-model="node.selectedLinkTarget" @input="(idx, el) => node.selectedLinkTarget = el"></DropdownList>
                <div class="buttons-container">
                  <button class="button-cancel" @click="node.addLinkInProcess = false"><img src="/res/icons/cross.svg" alt="cross">отменить</button>
                  <button class="button-save" @click="addLinkToNode(node, node.selectedLinkTarget); node.addLinkInProcess = false"><img src="/res/icons/save.svg" alt="plus">сохранить</button>
                </div>
              </div>
            </section>
          </foreignObject>
        </g>
      </svg>
    </DraggableComponent>
  </div>
</template>


<script>
import DraggableComponent from "~/components/DraggableComponent.vue";
import DropdownList from "~/components/DropdownList.vue";
import {defaultNodesConfig, ServicesConfigs, ServicesTypes} from "~/utils/constants";
import {NodesModel} from "~/utils/apiModels";
import validateModel from "@sergtyapkin/models-validator";

const MAP_WIDTH = 2000;
const MAP_HEIGHT = 2000;

const LOCALSTORAGE_NODES_NAME = 'nodes-data';
const LOCALSTORAGE_MONEY_NAME = 'total-money';

const MONEY_PER_100RPS = 10;
const MONEY_TIME_INTERVAL = 1000;

export default {
  components: {DropdownList, DraggableComponent},

  data() {
    return {
      nodes: [],
      totalPercentOut: undefined,
      totalRequestsIn: undefined,
      totalMoney: undefined,
      moneyUpdatingInterval: undefined,

      loading: false,

      MAP_WIDTH,
      MAP_HEIGHT,
      MONEY_PER_100RPS,
      MONEY_TIME_INTERVAL,
      ServicesTypes,
      ServicesConfigs,
    }
  },

  async mounted() {
    await this.loadNodes();
    await this.loadMoney();
    this.updateNodes();
    this.moneyUpdatingInterval = setInterval(this.increaseMoney, MONEY_TIME_INTERVAL);
  },
  unmounted() {
    clearInterval(this.moneyUpdatingInterval);
  },

  methods: {
    increaseMoney() {
      this.totalMoney += this.totalRequestsIn * this.totalPercentOut / 100 * MONEY_PER_100RPS;
      this.saveMoney();
    },
    async withdrawMoney() {
      if (!await this.$modal.confirm(`Зачислите ${this.totalMoney} $`, 'Зачислите эту сумму на счет команды. Здесь счет будет обнулен')) {
        return;
      }
      this.totalMoney = 0;
      this.saveMoney();
    },
    saveMoney() {
      localStorage.setItem(LOCALSTORAGE_MONEY_NAME, this.totalMoney);
    },

    async loadMoney() {
      const loadedMoney = localStorage.getItem(LOCALSTORAGE_MONEY_NAME);
      if (loadedMoney) {
        try {
          this.totalMoney = Number(loadedMoney) | 0;
          return;
        } catch (err) {
          this.$popups.error(`Ошибка ${err}`, 'Не удалось загрузить сохраненные данные сцены');
        }
      }
      this.totalMoney = 0;
    },
    async loadNodes() {
      const loadedNodes = localStorage.getItem(LOCALSTORAGE_NODES_NAME);
      if (loadedNodes) {
        try {
          const nodesData = JSON.parse(loadedNodes);
          this.nodes = validateModel(NodesModel, nodesData).nodes;
          return;
        } catch (err) {
          this.$popups.error(`Ошибка ${err}`, 'Не удалось загрузить сохраненные данные сцены');
        }
      }
      this.loading = true;
      let {ok, status, data} = this.$api.getNodesConfig();
      this.loading = false;

      if (!ok) {
        this.$popups.error(`Ошибка ${status}`, 'Не удалось получить данные узлов');
        data = defaultNodesConfig; // load default data;
      }
      this.nodes = validateModel(NodesModel, data).nodes;
    },

    getNode(id) {
      return this.nodes.find(node => +node.id === +id);
    },

    addServiceToNode(node, serviceType) {
      if (!serviceType) {
        return
      }
      node.services.push(serviceType);
      this.updateNodes();
    },
    deleteServiceFromNode(node, serviceIdx) {
      node.services.splice(serviceIdx, 1);
      this.updateNodes();
    },
    getAllNodeLinks(node) {
      // const allLinks = new Set(node.linkedTo.map(e => +e));
      const allLinks = new Set();
      this.nodes.forEach(otherNode => {
        if (+otherNode.id === +node.id) {
          return;
        }
        if (otherNode.linkedTo.map(e => +e).includes(+node.id)) {
          allLinks.add(+otherNode.id);
        }
      });
      return Array.from(allLinks);
    },

    addLinkToNode(node, linkTarget) {
      if (!linkTarget) {
        return
      }
      // if (node.linkedTo.includes(linkTarget.id) || (node.id === linkTarget.id)) {
      //   return;
      // }
      if (this.getAllNodeLinks(node).includes(+linkTarget.id) || (node.id === linkTarget.id)) {
        return;
      }
      node.linkedTo.push(linkTarget.id);
      this.updateNodes();
    },
    deleteLinkFromNode(node, linkIdx) {
      node.linkedTo.splice(linkIdx, 1);
      this.updateNodes();
    },

    updateNodes() {
      localStorage.setItem(LOCALSTORAGE_NODES_NAME, JSON.stringify(validateModel(NodesModel, {nodes: this.nodes})));

      // Calculate gen stats by nodes
      this.nodes.forEach(node => {
        node.totalDpsOut = 0;
        node.totalDpsIn = 0;
        node.totalRpsOut = 0;
        node.totalRpsIn = 0;
        node.totalMemOut = 0;
        node.totalMemIn = 0;
      });

      const iterateInOutCalcByAllNodes = () => {
        // Calculate in stats on nodes
        this.nodes.forEach(node => {
          let totalDpsIn = 0;
          let totalRpsIn = 0;
          let totalMemIn = 0;
          let totalUserPercentIn = 1;
          const allLinks = this.getAllNodeLinks(node);
          this.nodes.forEach(otherNode => {
            if (allLinks.includes(+otherNode.id)) {
              totalDpsIn += Math.max(0, otherNode.totalDpsOut);
              totalRpsIn += Math.max(0, otherNode.totalRpsOut);
              totalMemIn += Math.max(0, otherNode.totalMemOut);
              totalUserPercentIn = Math.min(totalUserPercentIn, otherNode.usersPercentOut);
            }
          });
          let totalDpsGen = 0;
          let totalRpsGen = 0;
          let totalMemGen = 0;
          let outDpsCoefficient = 1;
          let outRpsCoefficient = 1;
          let outMemCoefficient = 1;
          let outDpsAdding = 0;
          let outRpsAdding = 0;
          let outMemAdding = 0;
          let selfPercent = Infinity;
          // Calculate out stats on nodes
          node.services.forEach(service => {
            switch (String(service.type)) {
              case ServicesTypes.CDN:
                totalDpsGen += service.dps;
                totalRpsGen += service.rps;
                outDpsAdding += service.dps;
                outRpsAdding += service.rps;
                node.usersPercentOut = 1;
                break;
              case ServicesTypes.backend:
                totalDpsGen += service.dps;
                outDpsAdding += service.dps;
                outRpsAdding += service.rps;
                break;
              case ServicesTypes.monitoring:
                totalMemGen += service.mem;
                outMemAdding += service.mem;
                break;
              case ServicesTypes.database:
                totalMemGen += service.mem;
                outMemAdding += service.mem;
                outDpsAdding += service.dps;
                break;
              case ServicesTypes.balancer:
                outRpsCoefficient /= (node.linkedTo.length | 1);
                outDpsCoefficient /= (node.linkedTo.length | 1);
                outMemCoefficient /= (node.linkedTo.length | 1);
                break;
              case ServicesTypes.diskStorage:
                outMemAdding += service.mem;
                break;
              case ServicesTypes.backWithFront:
                totalRpsGen += service.rps;
                totalDpsGen += service.dps;
                outDpsAdding += service.dps;
                break;
            }
          });
          node.totalDpsGen = Math.max(0, totalDpsGen);
          node.totalRpsGen = Math.max(0, totalRpsGen);
          node.totalMemGen = Math.max(0, totalMemGen);

          node.services.forEach(service => {
            switch (String(service.type)) {
              case ServicesTypes.backend:
                selfPercent = Math.min(selfPercent, Math.abs(outRpsAdding) / totalRpsIn);
                break;
              case ServicesTypes.database:
                selfPercent = Math.min(selfPercent, Math.abs(outDpsAdding) / totalDpsIn);
                break;
              case ServicesTypes.diskStorage:
                selfPercent = Math.min(selfPercent, Math.abs(outMemAdding) / totalMemIn);
                break;
            }
          });
          node.totalDpsIn = totalDpsIn;
          node.totalRpsIn = totalRpsIn;
          node.totalMemIn = totalMemIn;
          node.totalDpsOut = (totalDpsIn + outDpsAdding) * outDpsCoefficient;
          node.totalRpsOut = (totalRpsIn + outRpsAdding) * outRpsCoefficient;
          node.totalMemOut = (totalMemIn + outMemAdding) * outMemCoefficient;
          node.usersPercentOut = totalUserPercentIn * Math.min(selfPercent, 1);
        });
      }

      this.nodes.forEach(() => {
        iterateInOutCalcByAllNodes();
      });

      // Calculate final percents
      let totalDpsGen = 0;
      let totalRpsGen = 0;
      let totalMemGen = 0;
      let totalDpsLoss = 0;
      let totalRpsLoss = 0;
      let totalMemLoss = 0;
      let minPercent = 1;
      this.nodes.forEach((node) => {
        totalDpsGen += node.totalDpsGen;
        totalRpsGen += node.totalRpsGen;
        totalMemGen += node.totalMemGen;

        if (!node.linkedTo?.length) { // Ending nodes
          node.isEnding = true;
          totalDpsLoss += Math.max(0, node.totalDpsOut);
          totalRpsLoss += Math.max(0, node.totalRpsOut);
          totalMemLoss += Math.max(0, node.totalMemOut);
        }

        minPercent = Math.min(minPercent, node.usersPercentOut);
      });
      const globalPercent = 1 - Math.max(0,
        (totalDpsLoss / totalDpsGen) | 0,
        (totalRpsLoss / totalRpsGen) | 0,
        (totalMemLoss / totalMemGen) | 0);
      console.log(totalDpsLoss , totalDpsGen,
      totalRpsLoss , totalRpsGen,
        totalMemLoss , totalMemGen)
      this.totalPercentOut = globalPercent * minPercent;
      this.totalRequestsIn = totalRpsGen;
    }
  },
}
</script>
