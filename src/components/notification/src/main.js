import Vue, { isVNode } from 'vue';
import Main from './main.vue';
//import merge from 'lodash';
import PopupManager from 'element-plus/lib/utils/popup-manager';
//import { isVNode } from 'element-plus/src/utils/vdom';
import _ from 'lodash';
const NotificationConstructor = Main;

let instance;
let instances = [];

const Notification = function(options) {
  if (Vue.prototype.$isServer) return;
  options = _.merge({}, options);

  options.onClose = function() {
    Notification.close();
  };

  instance = new NotificationConstructor({
    data: options
  });

  if (isVNode(options.buttonName)) {
    instance.$slots.default = [options.buttonName];
    options.buttonName = 'REPLACED_BY_VNODE';
  }

  instance.$mount();
  document.body.appendChild(instance.$el);
  instance.visible = true;
  instance.dom = instance.$el;
  instance.dom.style.zIndex = PopupManager.nextZIndex();

  let verticalOffset = options.offset || 0;
  instance.verticalOffset = verticalOffset;
  instances.push(instance);
  return instance;
};

Notification.close = function() {
  instances.splice(0, 1);
};

Notification.closeAll = function() {
    if (!_.isEmpty(instances)) instances[0].close();
};

export default Notification;