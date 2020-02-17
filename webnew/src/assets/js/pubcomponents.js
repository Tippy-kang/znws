import elliTooltip from "@/components/common/elli-tooltip.vue";
import fileUpload from "@/components/common/file-upload.vue";

const cmsComponents = {
    install: function (Vue) {
        Vue.component('elliTooltip', elliTooltip);
        Vue.component('fileUpload', fileUpload);
    }
}

// 导出组件
export default cmsComponents
