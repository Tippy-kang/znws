import moment from 'moment'

function weekTransfor(value) {
  let day = parseInt(value)
  switch (day) {
    case 0:
      return {
        value: 0,
        label: '星期日'
      }
      break;
    case 1:
      return {
        value: 1,
        label: '星期一'
      }
      break;
    case 2:
      return {
        value: 2,
        label: '星期二'
      }
      break;
    case 3:
      return {
        value: 3,
        label: '星期三'
      }
      break;
    case 4:
      return {
        value: 4,
        label: '星期四'
      }
      break;
    case 5:
      return {
        value: 5,
        label: '星期五'
      }
      break;
    case 6:
      return {
        value: 6,
        label: '星期六'
      }
      break;
    default:
      break;
  }
}


/**
 * 格式化时间
 * @param {String} originalTime - 需要被格式化的时间
 * @param {String} format - 格式化类型
 * @param {String} addDay - 需要增加或者减少的天数
 * @param {String} addMonth - 需要增加或者减少的月数
 * @return {String} 格式化后的时间
 */


export default class MomentHandle {
  static formatTime(originalTime, format = 'YYYY-MM-DD HH:mm:ss', addDay = 0, addMonth = 0) {
    if (!originalTime) return
    let formatedTime = moment(originalTime).add(addDay, 'days').add(addMonth, 'months').format(format)
    if (formatedTime === 'Invalid date')
      return originalTime
    else
      return format !== 'd' ? formatedTime : weekTransfor(parseInt(formatedTime))
  }

  static getDaysInMonth(time) {
    return moment(time, "YYYY-MM").daysInMonth()
  }

  static currentWeekday(date, currentDay = 1) {
    return moment(date).date(currentDay).weekday()
  }

  static startOfMonth(date) {
    return this.formatTime(moment(date).startOf('month'), 'YYYY-MM-DD 00:00:00')
  }

  static endOfMonth(date) {
    return this.formatTime(moment(date).endOf('month'), 'YYYY-MM-DD 23:59:59')
  }

  static exportForm(url) {
    var dlform = document.createElement('form');
    dlform.style = "display:none;";
    dlform.method = 'get';
    dlform.action = url;
    document.body.appendChild(dlform);
    dlform.submit();
    document.body.removeChild(dlform);
  }

  // static downloadIamge(imgsrc, name) {//下载图片地址和图片名
  //   var image = new Image();
  //   // 解决跨域 Canvas 污染问题
  //   image.setAttribute("crossOrigin", "anonymous");
  //   image.onload = function () {
  //     var canvas = document.createElement("canvas");
  //     canvas.width = image.width;
  //     canvas.height = image.height;
  //     var context = canvas.getContext("2d");
  //     context.drawImage(image, 0, 0, image.width, image.height);
  //     var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
  //
  //     var a = document.createElement("a"); // 生成一个a元素
  //     var event = new MouseEvent("click"); // 创建一个单击事件
  //     a.download = name || "photo"; // 设置图片名称
  //     a.href = url; // 将生成的URL设置为a.href属性
  //     a.dispatchEvent(event); // 触发a的单击事件
  //   };
  //   image.src = imgsrc;
  // }
}


