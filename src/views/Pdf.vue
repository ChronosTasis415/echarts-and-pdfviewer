<template>
  <div class="pdf-viewer col">
    <div class="top-banner row">
      <svg
        v-svg
        symbol="arrow-left-white"
        class="back"
        @click="onBackClick"
        size="28"
      ></svg>
      <div class="file-name" v-if="copyFileList.length">
        {{ currentFileName }}
      </div>
    </div>
    <div class="main row">
      <div :class="['left', isLeftFold && 'left-fold']">
        <div class="fold-btn" @click="onLeftToggle">
          <svg v-svg symbol="fold-left" size="16" v-if="!isLeftFold"></svg>
          <svg v-svg symbol="menu" size="16" v-else></svg>
        </div>

        <div
          :class="['file-item', 'row', activeIndex === index && 'active-item']"
          v-for="(file, index) in copyFileList"
          :key="index"
          @click="onFileResultClick(file, index)"
        >
          <div class="name">{{ file.fileName }}</div>
          <svg
            :class="[
              'status-icon',
              file.fileStatus === 'ing' && 'transform-icon',
            ]"
            v-svg
            :symbol="file.fileStatus === 'success' ? 'done' : 'ing'"
            size="16"
          ></svg>
        </div>
      </div>
      <div
        class="content row"
      >
        <div class="pdf-container">
          <div class="pdf-viewer" ref="pdf-container"></div>
          <div class="pager-jump">
            <el-input
              name="input"
              class="input-jump"
              v-model="currentPage"
              @change="onCurrentPageChange"
            ></el-input
            >/<span>{{ totalPageNum }}</span>
          </div>
        </div>
        <div class="result">
          <entity-result
            :results="formatEntityResultWidthColor"
            @onHighlightFoucs="onHighlightFoucs"
          ></entity-result>
          <relation-result
            :results="formatRelationResultWidthColor"
            @onHighlightFoucs="onHighlightFoucs"
          ></relation-result>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from "vue-property-decorator";
import EntityResult from "@/components/pdf/EntityResult.vue";
import RelationResult from "@/components/pdf/RelationResult.vue";
import { PDFViewer } from "web-pdf-viewer";
import { colorList } from "@/helpers/colorList";
import { v4 as uuidv4 } from "uuid";

enum NlpStatus {
  success,
  ing,
}

type Annot = {
  x: number;
  y: number;
  attrs?: {
    txt: string;
    fontSize: string;
    color: string;
    backgroundColor: string;
  };
  w: number;
  highlightClass?: string;
  page: number;
  h: number;
  bgColor?: string;
  borderColor: string;
};

type AnnResults = {
  entityName: string;
  rects: Annot[];
};

type Color = {
  bg: string;
  border: string;
  bgClass: string;
  borderClass: string;
};

type File = {
  fileName: string;
  filePath: string;
  fileSize: string;
  fileType: string;
  fileStatus?: string;
  uuid?: string;
};

@Component({
  components: { EntityResult, RelationResult },
})
export default class PdfViewer extends Vue {
  @Prop({ type: String })
  modelId!: string;

  @Ref("pdf-container") pdfContainer!: HTMLElement;

  symbolIdMap: any[] = [];

  colorList = colorList;

  currentPage = 1;

  isLoading = true;

  annResults: any[] = [];

  totalPageNum = 0;

  activeIndex = 0;

  pv: PDFViewer | null = null;

  currentHighlights: PlainObject[] = [];

  sourcePdf = null;

  copyFileList: File[] = [];

  get currentFileName(): string {
    return this.copyFileList[0].fileName;
  }

  set currentFileName(val) {
    this.copyFileList[0].fileName = val;
  }

  // 左侧是否折叠
  isLeftFold = false;

  onLeftToggle(): void {
    this.isLeftFold = !this.isLeftFold;
  }

  get fileListToAnn(): File[] {
    return this.$store.state.modelUploadList;
  }

  get fileList(): File[] {
    const fileList = this.fileListToAnn.map((el) => ({
      fileName: el.fileName,
      filePath: el.filePath,
      fileSize: el.fileSize,
      fileType: el.fileType,
      fileStatus: "ing",
      uuid: el.fileName + el.fileSize,
    }));

    return fileList;
  }

  annResultEntity: any[] = [
    {
      entityName: "公告发布主体",
      pos: [
        {
          pageNum: 1,
          text: "河南中原高速公路股份有限公司",
          rects: [
            {
              height: 15.96,
              left: 185.66,
              width: 223.77,
              top: 139.92,
              pageId: 1,
            },
          ],
        },
      ],
    },
    {
      entityName: "会议召开届次",
      pos: [
        {
          pageNum: 1,
          text: "第五届董事会第二十七次会议",
          rects: [
            {
              height: 15.96,
              left: 161.66,
              width: 207.88,
              top: 161.98,
              pageId: 1,
            },
          ],
        },
      ],
    },
    {
      entityName: "会议召开日期",
      pos: [
        {
          pageNum: 1,
          text: "2017年4月25日",
          rects: [
            { height: 12, left: 189.02, width: 93.03, top: 308.33, pageId: 1 },
          ],
        },
      ],
    },
    {
      entityName: "议案选取",
      pos: [
        {
          pageNum: 1,
          text: "《关于公司2017年第一季度报告的议案》",
          rects: [
            { height: 12, left: 198.02, width: 222.05, top: 463.64, pageId: 1 },
          ],
        },
        {
          pageNum: 1,
          text: "《关于对公司路域经营业务进行整合的议案》",
          rects: [
            { height: 12, left: 198.02, width: 240.05, top: 538.64, pageId: 1 },
          ],
        },
      ],
    },
  ];

  annResultRelation: any[] = [];

  onFileResultClick(file: any, index = 0): void {
    const elArryLike = Array.prototype.slice.call(
      document.querySelectorAll(".special-value-item")
    );
    elArryLike.forEach((el) => {
      el.setAttribute("class", "entity-relation-value-item");
    });
    this.activeIndex = index;
    const currentResult = this.annResults.find((el) => el.uuid === file.uuid);
    this.annResultRelation = [];
    this.currentFileName = file.fileName;
    this.annResultEntity = currentResult.fileData.entity;
    // this.renderPdf(`${location.origin}/api/projectModel/downloadFile?filePath=${file.filePath}&fileName=${file.fileName}`);
  }

  // annRequest(fileItem: any): void {
  //   const query = {
  //     taskFileList: [
  //       {
  //         fileSize: fileItem.fileSize,
  //         filePath: fileItem.filePath,
  //         fileType: fileItem.fileType,
  //         fileName: fileItem.fileName,
  //       },
  //     ],
  //     modelId: this.modelId,
  //   };
  //   const targetFileIndex = this.copyFileList.findIndex(
  //     (el) => el.uuid === fileItem.uuid
  //   );
  //   Request.post(APIs.MODEL.TEST, null, query)
  //     .success((res) => {
  //       const result = {
  //         uuid: fileItem.uuid,
  //         fileData: res.data[0].fileData,
  //       };
  //       this.annResults.push(result);
  //       this.copyFileList[targetFileIndex]!.fileStatus = "success";
  //       if (targetFileIndex === 0) {
  //         this.onFileResultClick(fileItem);
  //       }
  //     })
  //     .fail(() => {
  //       this.copyFileList[targetFileIndex]!.fileStatus = "fail";
  //     });
  // }

  // 为每一项rect带上背景色和边框色

  get formatEntityResultWidthColor() {
    return this.annResultEntity.map((item, index) => ({
      ...item,
      bgColor: this.colorList[index].bg,
      bgClassName: this.colorList[index].bgClassName,
      borderClassName: this.colorList[index].borderClassName,
    }));
  }

  get formatRelationResultWidthColor() {
    return this.annResultRelation.map((item, index) => ({
      relationName: item.relationName,
      // @ts-ignore
      entityNames: item.entityNames.map((relation) => ({
        ...relation,
        bgColor: this.colorList[this.colorList.length - 1 - index].bg,
        bgClassName: this.colorList[this.colorList.length - 1 - index]
          .bgClassName,
        borderClassName: this.colorList[this.colorList.length - 1 - index]
          .borderClassName,
      })),
    }));
  }

  onCurrentPageChange(inputPage: any): void {
    const page = Number(inputPage);
    if (typeof page === "number" && page <= this.totalPageNum) {
      this.currentPage = page;
    } else {
      this.currentPage = 1;
    }
    this.pv!.scrollTo(this.currentPage, 500);
  }

  renderPdf(): void {
    this.isLoading = true;
    const el = document.querySelector(".pdf-container .pdf-viewer");
    el!.innerHTML = "";
    this.pv = new PDFViewer({
      container: this.pdfContainer as HTMLElement,
      url: "./mock/demo.pdf",
      containerBackground: "#F7F7F7",
      gap: 0,
      cmaps: "/cmaps/",
      // 是否渲染文字层
      isRenderText: true,
    });
    this.pv.addEventListener("load", this.renderAnnots);
    this.pv.addEventListener("pagechange", this.onPdfPageChange);
  }

  renderAnnots(): void {
    this.isLoading = false;
    const pdfInfo = this.pv!.getPDFInfo();
    this.totalPageNum = pdfInfo.totalPages;
    if (this.formatEntityResultWidthColor.length !== 0) {
      this.formatEntityResultWidthColor.forEach((category) => {
        // @ts-ignore
        category.pos.forEach((pos) => {
          // @ts-ignore
          pos.rects.forEach((rect) => {
            // @ts-ignore
            rect.id = uuidv4();
            const params = {
              w: rect.width,
              h: rect.height,
              x: rect.left,
              y: rect.top,
              page: rect.pageId,
              highlightClass: category.bgClassName,
            };
            const symbolId = this.pv!.highlight(params);
            this.symbolIdMap.push({
              highlightId: symbolId,
              // @ts-ignore
              uuid: rect.id,
            });
          });
        });
      });
    }

    if (this.formatRelationResultWidthColor.length !== 0) {
      this.formatRelationResultWidthColor.forEach((relation) => {
        // @ts-ignore
        relation.entityNames.forEach((item) => {
          // @ts-ignore
          item.rects.forEach((rect) => {
            // @ts-ignore
            rect.id = uuidv4();
            const params = {
              w: rect.width,
              h: rect.height,
              x: rect.left,
              y: rect.top,
              page: rect.pageId,
              highlightClass: item.bgClassName,
            };
            const symbolId = this.pv!.highlight(params);
            this.symbolIdMap.push({
              highlightId: symbolId,
              // @ts-ignore
              uuid: rect.id,
            });
          });
        });
      });
    }
  }

  onPdfPageChange(ev: any): void {
    this.currentPage = ev.page;
  }

  observer: MutationObserver | null = null;

  onHighlightFoucs(data: any): void {
    this.removeHighlightFocus();
    this.currentHighlights = [];
    const type = data.type;
    const res = data.data;
    if (type === "hide") {
      return;
    }

    const config = { attributes: true, childList: true, subtree: true };

    const that = this;
    if (this.observer) {
      this.observer!.disconnect();
    }
    // 滚动到第一个高亮处
    this.pv!.scrollTo(res[0].page, res[0].top, function () {
      const targetEls = document.querySelectorAll(".pdf-viewer-666 .pdf-page");
      const targetindex = res[0].page;
      const targetEl = targetEls[targetindex - 1];
      // @ts-ignore
      const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
          if (mutation.type === "attributes") {
            if (mutation.target.dataset.load === "true") {
              // @ts-ignore
              res.forEach((ele) => {
                const targetHighlightId = that.symbolIdMap.find(
                  (el) => el.uuid === ele.uuid
                );
                that.currentHighlights.push({
                  id: targetHighlightId.highlightId,
                  page: ele.page,
                });
                that.pv!.highlightFocus(
                  ele.page,
                  targetHighlightId.highlightId,
                  ele.borderClassName
                );
              });
            }
          }
        }
      };
      that.observer = new MutationObserver(callback);
      that.observer.observe(targetEl, config);
      // @ts-ignore
      res.forEach((ele) => {
        const targetHighlightId = that.symbolIdMap.find(
          (el) => el.uuid === ele.uuid
        );
        that.currentHighlights.push({
          id: targetHighlightId.highlightId,
          page: ele.page,
        });
        that.pv!.highlightFocus(
          ele.page,
          targetHighlightId.highlightId,
          ele.borderClassName
        );
      });
    });
  }

  removeHighlightFocus(): void {
    if (this.currentHighlights.length) {
      this.currentHighlights.forEach((el) => {
        this.pv!.highlightBlur(el.page, el.id);
      });
    }
    this.currentHighlights = [];
  }

  onBackClick(): void {
    this.$router.go(-1);
  }

  mounted(): void {
    this.copyFileList = JSON.parse(JSON.stringify(this.fileList));
    this.renderPdf();
  }

  beforeDestory(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
</script>
<style lang="scss" scoped>
.pdf-viewer {
  height: 100%;
  background-color: #f7f7f7;
  .top-banner {
    align-items: center;
    padding: 10px 40px;
    background-color: #363636;
    .back {
      cursor: pointer;
    }
    .file-name {
      margin-right: auto;
      margin-left: 16px;
      font-size: 14px;
      line-height: 22px;
      color: #ffffff;
    }
  }
  .main {
    overflow: hidden;
    flex: 1;
    .left {
      position: relative;
      width: 240px;
      padding-top: 24px;
      background-color: #ffffff;
      border-right: 1px solid #e5e5e5;
      .fold-btn {
        position: absolute;
        top: 24px;
        right: 0px;
        width: 36px;
        height: 36px;
        line-height: 42px;
        text-align: center;
        background-color: #ffffff;
        box-shadow: 0px 6px 18px rgba(45, 47, 51, 0.14);
        border-radius: 50%;
        transform: translateX(50%);
        cursor: pointer;
        z-index: 4999;
      }
      &.left-fold {
        width: 0;
        .fold-btn {
          left: 24px;
        }
      }
      .file-item {
        padding: 10px 16px;
        align-items: center;
        cursor: pointer;
        &.active-item {
          background-color: #f7f7f7;
        }
        > .name {
          margin-right: 2px;
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          word-break: break-all;
        }
        .status-icon {
          &.transform-icon {
            animation: myRotate 1s linear infinite;
            @keyframes myRotate {
              0% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(180deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          }
        }
      }
    }
    .content {
      flex: 1;
      justify-content: center;
      .pdf-container {
        position: relative;
        .pdf-viewer {
          width: 600px;
          padding: 24px 0;
        }
        .pager-jump {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 26px;
          color: #ffffff;
          background-color: #00000060;
          border-radius: 2px;
          z-index: 999;
          ::v-deep .el-input {
            &.input-jump {
              display: inline-block;
              width: 20px;
              .el-input__inner {
                padding: 0;
                background-color: transparent;
                border: none;
                color: #ffffff;
                height: 22px;
                line-height: 22px;
                font-size: 16px;
              }
            }
          }
        }
      }

      .result {
        overflow: auto;
        width: 300px;
        margin-left: 40px;
        border-left: 1px solid #e5e5e5;
      }
    }
  }
}
</style>