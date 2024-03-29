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
      .node-container
        .node
          font-small()
          overflow visible
          width = 220px
          height = 450px
          border 1px solid colorBg10
          border-radius borderRadiusL
          padding 10px
          background colorBg3
          width width
          height height
          transform translate(- width / 2, - height / 2)
          .name
            text-align center
            font-large()
            margin-bottom 10px
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
              img
                width 20px
                cursor pointer
            .button-add
              button()
            .button-save
              button-success()
            .button-cancel
              button-danger()
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
          >
            <header class="name">{{ node.name }}</header>

            <section class="services">
              <header class="header">Сервисы</header>
              <div v-for="(service, serviceIdx) in node.services" class="one-item">{{ service.name }}<img src="/res/icons/trashbox.svg" alt="delete" @click="deleteServiceFromNode(node, serviceIdx)"></div>
              <button v-if="!node.addServiceInProcess" class="button-add" @click="node.addServiceInProcess = true"><img src="/res/icons/plus.svg" alt="plus">добавить сервис</button>
              <div v-if="node.addServiceInProcess">
                <DropdownList :list="Object.values(ServicesTypes)" v-model="node.selectedServiceType" @input="(el) => node.selectedServiceType = el"></DropdownList>
                <button class="button-save" @click="addServiceToNode(node, node.selectedServiceType); node.addServiceInProcess = false"><img src="/res/icons/save.svg" alt="plus">сохранить</button>
                <button class="button-cancel" @click="node.addServiceInProcess = false"><img src="/res/icons/cross.svg" alt="cross">отменить</button>
              </div>
            </section>

            <section class="links">
              <header class="header">Связи</header>
              <div v-for="(link, linkIdx) in node.linkedTo" class="one-item">{{ link }}<img src="/res/icons/trashbox.svg" alt="delete" @click="deleteLinkFromNode(node, linkIdx)"></div>
              <button v-if="!node.addLinkInProcess" class="button-add" @click="node.addLinkInProcess = true"><img src="/res/icons/plus.svg" alt="plus">добавить связь</button>
              <div v-if="node.addLinkInProcess">
                <DropdownList :list="Object.values(nodes)" v-model="node.selectedLinkTarget" @input="(el) => node.selectedLinkTarget = el"></DropdownList>
                <button class="button-save" @click="addLinkToNode(node, node.selectedLinkTarget); node.addLinkInProcess = false"><img src="/res/icons/save.svg" alt="plus">сохранить</button>
                <button class="button-cancel" @click="node.addLinkInProcess = false"><img src="/res/icons/cross.svg" alt="cross">отменить</button>
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
import {ServicesTypes} from "~/utils/constants";
import {NodesModel} from "~/utils/apiModels";
import validateModel from "@sergtyapkin/models-validator";

const MAP_WIDTH = 2000;
const MAP_HEIGHT = 2000;

const LOCALSTORAGE_NODES_NAME = 'nodes-data';

export default {
  components: {DropdownList, DraggableComponent},

  data() {
    return {
      nodes: [],
      minX: undefined,
      minY: undefined,
      maxX: undefined,
      maxY: undefined,

      loading: false,

      MAP_WIDTH,
      MAP_HEIGHT,
      ServicesTypes,
    }
  },

  async mounted() {
    await this.updateNodes();
  },

  methods: {
    async updateNodes() {
      const loadedNodes = localStorage.getItem(LOCALSTORAGE_NODES_NAME);
      let nodesData = null;
      if (loadedNodes) {
        nodesData = JSON.parse(loadedNodes);
      } else {
        this.loading = true;
        const {ok, status, data} = this.$api.getNodesConfig();
        this.loading = false;

        if (!ok) {
          this.$popups.error(`Ошибка ${status}`, 'Не удалось получить данные узлов');
          return;
        }
        nodesData = data;
      }
      this.nodes = validateModel(NodesModel, nodesData).nodes;
    },

    getNode(id) {
      return this.nodes.find(node => +node.id === +id);
    },

    addServiceToNode(node, serviceType) {
      if (!serviceType) {
        return
      }
      node.services.push(serviceType);
    },
    deleteServiceFromNode(node, serviceIdx) {
      node.services.splice(serviceIdx, 1);
    },

    addLinkToNode(node, linkTarget) {
      if (!linkTarget) {
        return
      }
      if (node.linkedTo.includes(linkTarget.id) || (node.id === linkTarget.id)) {
        return;
      }
      node.linkedTo.push(linkTarget.id);
    },
    deleteLinkFromNode(node, linkIdx) {
      node.linkedTo.splice(linkIdx, 1);
    }
  },

  watch: {
    nodes: {
      handler() {
        localStorage.setItem(LOCALSTORAGE_NODES_NAME, JSON.stringify({nodes: this.nodes}));
      },
      deep: true,
    }
  }
}
</script>
