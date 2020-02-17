/* eslint-disable */
// require('script-loader!file-saver');
import FileSaver from 'file-saver';
import XLSX from 'xlsx'
import XLSXSTYLE from 'xlsx-style'

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}
/**
 * xlsx-style 引入会报错
 * 将\node_modules\xlsx-style\dist\cpexcel.js 807行 的 var cpt = require(’./cpt’ + ‘able’) 改成 var cpt = cptable
 */
/**
 * 
 * @param {*} id  导出表格的id 或 class
 * @param {*} header  表头信息 若[1,2]表示第二行到第三行为表头
 * @param {*} title  第一行的表题
 * @param {*} mergeCells  合并的单元格 style 合并行的样式 rowIndex和并的行数 其他合并行的样式
 */
export function export_table_to_excel(id,header,title,mergeCells) {
  title = title || ""
  header = header || []
  mergeCells = mergeCells || {rowIndex:1}
 /* original data */
  var wb;
  // 判断是否有固定表头
  let table = document.querySelector(id)
  var fix = table.querySelector('.el-table__fixed');
  // var gutter = table.querySelector('.gutter')


  //开头空 rowIndex 行,需修改源码 将\node_modules/xlsx/xlsx.js 19023行 此 parse_dom_table 方法添加 代码 var _R = 0, R = _opts.rowIndex || 0, _C, C, RS, CS;
  var opt = {
    rowIndex: mergeCells.rowIndex||1,
    raw:true
  };


  if (fix) {
    wb = XLSX.utils.table_to_sheet(document.querySelector(id).removeChild(fix),opt);
    document.querySelector(id).appendChild(fix);
  } else {
    wb = XLSX.utils.table_to_sheet(document.querySelector(id),opt);
  }
    
  const borderAll = {  //单元格外侧框线
    top: {
      style: 'thin'
    },
    bottom: {
      style: 'thin'
    },
    left: {
      style: 'thin'
    },
    right: {
      style: 'thin'
    }
  };

  //给所以单元格加上边框 

  let arr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ"];

  let rowCount = wb['!ref'].split(':')[1].match(/\d+$/gi).join('')

 
  //若有gutter 则多出一列 需-1 只支持54列
  // if(gutter){
    
  //   let tmp = wb['!ref']
  //   let letter = arr[arr.indexOf(tmp.split(':')[1].match(/^[a-z|A-Z]+/gi).join('')) - 1]
    
  //   wb['!ref'] = tmp.split(':')[0] + ":" + letter + rowCount

  // }


  let colCount = arr.indexOf(wb['!ref'].split(':')[1].match(/^[a-z|A-Z]+/gi).join(''))
 // header 为表头信息为空则移除为空的这一列  
  // 若第一列为空则表格有单选框，移除这列
  // 若最后一列为空则拥有gutter滚动条这列，移除列
  
  let colArr = arr.filter((el,i)=>{
      if(i <= colCount){
        return el
      }
  })
  //判断第一列和最后一列是否为空
  let firstCol = true
  let lastCol = true

  //表头只要有一个不为空则该列有值
  
  for (let i = 0; i < header.length; i++) {
    //第一列
    if(firstCol){
      if(wb['A'+header[i]].v){
        firstCol = false
      }
    }
    //最后一列
    if(lastCol){
      if(wb[colArr[colArr.length-1] +header[i]] && wb[colArr[colArr.length-1] +header[i]].v){
        lastCol = false
      }
    }
  }

  //移除第一列
  if(firstCol){
    for (let i in wb) {
      if (i == '!ref' || i == '!merges' || i == '!cols') {

      } else {
        let before = i.match(/^[a-z|A-Z]+/gi).join('')
        let after = i.match(/\d+$/gi).join('');
        
        if(colArr[colArr.indexOf(before)+1]){
          wb[i] = wb[colArr[colArr.indexOf(before)+1]+after]
        }else{
          // console.log(i);
        }
        
      }
     
    }
    let tmp = wb['!ref']
    let letter = arr[arr.indexOf(tmp.split(':')[1].match(/^[a-z|A-Z]+/gi).join('')) - 1]
    
    wb['!ref'] = tmp.split(':')[0] + ":" + letter + rowCount
  }
  //移除最后一列
  if(lastCol){
    let tmp = wb['!ref']
    let letter = arr[arr.indexOf(tmp.split(':')[1].match(/^[a-z|A-Z]+/gi).join('')) - 1]
    
    wb['!ref'] = tmp.split(':')[0] + ":" + letter + rowCount
  }
  
  let tablecol = arr.indexOf(wb['!ref'].split(':')[1].match(/^[a-z|A-Z]+/gi).join(''))
  //给表格加边框
  for (let j = 1; j <= rowCount; j++) {
    arr.forEach((v,i)=>{
      if(i <= tablecol){
        
        if(wb[v + '' + j]){
          wb[v + '' + j].s = {
            border: borderAll,
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText:true
            }
          }
        }else{
          wb[v + '' + j] = {
            s: {
              border: borderAll,
              alignment: {
                horizontal: "center",
                vertical: "center",
                wrapText:true
              }
            },
            t: "s",
            v: ""
          }
        }
      }
    })
    
  }


  let number = arr.indexOf(wb['!ref'].split(':')[1].match(/^[a-z|A-Z]+/gi).join(''))

  
  for (var i in wb) {
    if (i == '!ref' || i == '!merges' || i == '!cols') {

    } else {
      if(wb[i + '']){
        // wb[i + ''].s = {
        //   border: borderAll
        // }
      }else{
        wb[i + ''] = {
          s: {
            border: borderAll,
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText:true
            }
          },
          t: "s",
          v: ""
        }
      }
      
      let after = i.match(/\d+$/gi).join('');
      
      let before = i.match(/^[a-z|A-Z]+/gi).join('')
      //设置表头样式
      if(header.indexOf(after) !== -1){
        if(arr.indexOf(before) <= number){
          
          wb[i].s = {
            font: {
              name: '宋体',
              sz: 14,
              color: {rgb: "000000"},
              bold: true,
              italic: false,
              underline: false
            },
            border: borderAll,
            alignment: {
              horizontal: "center",
              vertical: "center",
              wrapText:true
            },
            fill: {
              fgColor: {rgb: "D9D9D9"},
            },
          };
        }
        
        
      }

    }
  }

  let colWidth = []

  /*设置worksheet每列的最大宽度*/

  for(let i = 0;i<=tablecol + 1;i++){
    //设置最小宽度为 10 
    colWidth[i] = { 'wch': 10 }
  }
  for (var i in wb) {
    if (i == '!ref' || i == '!merges' || i == '!cols') {

    } else {
      let index = arr.map(el=>el).indexOf(i.match(/^[a-z|A-Z]+/gi).join(''))
      
      if(wb[i + ''].v){
        let val = wb[i + ''].v
        if(val.toString().charCodeAt(0) > 255){
          if(val.toString().length * 2 + 5 > colWidth[index].wch){
            colWidth[index].wch = 20
          }
        }else{
          if(val.toString().length + 5 > colWidth[index].wch){
            colWidth[index].wch = 76
          }
        }
      } 
    }
  }

  
  wb['!cols'] = colWidth;

  //为表格设置边框

  //合并第一行单元格 显示标题行

    wb['!merges'].push({
      s: {
        r: 0,
        c: 0
      },
      e: {
        r: 0,
        c: tablecol 
      }
    })
  //设置标题行样式
    wb["A1"]= {
      s: {
        font: {
          name: '宋体',
          sz: 18,
          color: {rgb: "000000"},
          bold: true,
          italic: false,
          underline: false
        },
        alignment: {
          horizontal: "center",
          vertical: "center"
        },
        border:borderAll
      },
      t: "s",
      v: title
    };

  //设置合并单元格的 行样式
  if(opt.rowIndex > 1){
    for (let i = 1; i < mergeCells.rowIndex; i++) {
      wb['!merges'].push({
        s: {
          r: i,
          c: 0
        },
        e: {
          r: i,
          c: colCount 
        }
      })
    }

    for (let key in mergeCells.style) {
      wb[key] = mergeCells.style[key]
    }

  }

  
  // return
  var wbout = XLSXSTYLE.write(sheet2blob(wb), {
    bookType: 'xlsx',
    bookSST: true,
    type: 'binary'
  });

  FileSaver.saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), title + ".xlsx")
}
// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
  sheetName = sheetName || 'sheet1';
  var workbook = {
      SheetNames: [sheetName],
      Sheets: {}
  };
  workbook.Sheets[sheetName] = sheet; // 生成excel的配置项
  return workbook;
}