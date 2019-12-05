import {touchEvent} from './event-bus'

function __emitTap(type, event) {
  let pageX = event.changedTouches[0].pageX;
  let pageY = event.changedTouches[0].pageY;
  touchEvent.emit(type, [Math.floor(pageX), Math.floor(pageY)])
}

let timer2longPress;

export default {
  bind(el, binding, vnode, oldVnode) {
    const config = {
      tap: 'double',
      interval: 500,      //默认时间间隔，只有double 的时候有用
      timekeep: 1000,     //默认时间长短，只有longPress 的时候有用
      preventTouchNative: true,    //默认禁止原生手机端的touch事件
    }
    const {value: usrOption} = binding;
    const tapOption = Object.assign(config, usrOption)

    el.addEventListener('touchend', (event) => {
      if (tapOption.tap === "single") return __emitTap('single', event);

      if (tapOption.tap === "double") {
        //如果面板已经弹出
        if (touchEvent.visible) {
          touchEvent.emit("close");
          return
        }

        touchEvent.times += 1;
        setTimeout(() => {
          touchEvent.times = 0
        }, tapOption.interval);
        if (touchEvent.times === 2) return __emitTap('double', event)
      }

      if (tapOption.tap === "longPress") {
        touchEvent.keep = false
        window.clearTimeout(timer2longPress);
      }

    })

    el.addEventListener('touchstart', (event) => {
      if (tapOption.preventTouchNative) event.preventDefault();

      if (tapOption.tap === "longPress"){
        touchEvent.emit("close");
        touchEvent.keep = true;

        timer2longPress = setTimeout(() => {
          if (touchEvent.keep) __emitTap('longPress', event)
        }, tapOption.timekeep)
      }
    })
  }
}

