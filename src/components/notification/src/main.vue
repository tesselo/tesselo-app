<template>
  <transition name="el-notification-fade">
    <div
      v-show="visible"
      :style="positionStyle"
      class="el-notification right"
      role="alert">
      <i
        class="el-notification__icon el-icon-info"
      />
      <div 
        class="el-notification__group">
        <h2 
          class="el-notification__title" 
          v-text="title"
        />
        <div 
          v-show="buttonName"
          class="el-notification__content"> 
          <slot>
            <button 
              type="button" 
              class="el-button el-button--info el-button--small" 
              @click="click">
              <i class="el-icon-document"/>
              <span>{{ buttonName }}</span>
            </button>
          </slot>
        </div>
        <div 
          v-if="haveAttributes"
          :class="{'table-height-with-btn' : table}" 
          class="el-notification__content table-height-no-btn">
          <el-collapse>
            <el-collapse-item title="Attributes">
              <el-table
                :data="tableData"
                stripe
                height="350"
                style="width: 99%">
                <el-table-column
                  prop="attribute"
                  label="Attribute"
                  width="auto" />
                <el-table-column
                  prop="value"
                  label="Value"
                  width="auto" />
              </el-table>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div 
        v-if="showClose"
        class="el-notification__closeBtn el-icon-close"
        @click.stop="close"
      />
    </div>
  </transition>
</template>

<script>
  export default {
    data() {
      return {
        visible: false,
        title: '',
        buttonName: '',
        showClose: true,
        onClose: null,
        onClick: null,
        closed: false,
        verticalOffset: 0,
        timer: null,
        expand: false,
        activeName: '1',
        haveAttributes: true,
        table: false,
        tableData: []
      };
    },

    computed: {
      verticalProperty() {
        return /^top-/.test(this.position) ? 'top' : 'bottom';
      },

      positionStyle() {
        return {
          [this.verticalProperty]: `${ this.verticalOffset }px`
        };
      }
    },

    watch: {
      closed(newVal) {
        if (newVal) {
          this.visible = false;
          this.$el.addEventListener('transitionend', this.destroyElement);
        }
      }
    },

    mounted() {
      document.addEventListener('keydown', this.keydownEscToClose);
    },

    beforeUnmount() {
      document.removeEventListener('keydown', this.keydownEscToClose);
    },

    methods: {
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },

      click() {
        if (typeof this.onClick === 'function') {
          this.onClick();
        }
      },

      close() {
        this.closed = true;
        if (typeof this.onClose === 'function') {
          this.onClose();
        }
      },
      
      keydownEscToClose(e) {
        if (e.keyCode === 27) { 
          if (!this.closed) {
            this.close();
            e.preventDefault()
          }
        }
      }
    },
  };
</script>

<style scoped>
  .el-notification {
    width: auto;
    height: auto;
    min-width: 50%;
    right: 10px;
    padding: 14px 38px 14px 13px;
    
  }
  .el-notification__group {
    width: 91%;
  }
  .el-notification__content {
    margin-top: 17px;
  }
  .el-notification__closeBtn {
    top: 8px;
    right: 8px;
    padding: 6.5px;
    font-size: 19px;
  }
  .el-notification__title {
    line-height: 22px;
    overflow-wrap: break-word;
  }

  @media screen and (max-width: 768px), (max-height: 650px) {
    .el-notification {
        width: 100%;
        height: 100%;
        right: 0px;
        bottom: 0px !important;
    }
    
    .table-height-no-btn {
      background: center 15px no-repeat;
      height: 90% !important;
    }

    .table-height-no-btn.table-height-with-btn {
      height: 84% !important;
    }
    
    .el-collapse {
          border-bottom: none;

      height: 100% !important;
    }

    .el-collapse-item.is-active {
      height: 100% !important;
    }

    .el-collapse-item.is-active :deep(.el-collapse-item__wrap) {
      height: 90% !important;
      border-bottom: none;
    }
    
    .el-collapse-item.is-active :deep(.el-collapse-item__content) {
      height: 100% !important;
      padding-bottom: 0px !important;
    }

    .el-table {
      height: 98% !important;
    }

    .el-table__body-wrapper {
      height: 84% !important;
    }

  }
</style>

