<template>
  <div class="user-sidebar-wrapper">
    <a
      v-if="authenticated"
      href="javascript:void(0)"
      class="open d-flex flex-row justify-content-center align-items-center"
      @click="openSidebar"
    >
      <img
        :src="iconHamburgerUrl"
        alt="">
    </a>
    <div
      :class="['user-sidebar d-flex flex-column justify-content-between align-items-start', { 'user-sidebar--open': open }]"
    >
      <a
        href="javascript:void(0)"
        class="close"
        @click="closeSidebar">
        <svg
          width="24"
          height="24"
          x="0px"
          y="0px"
          viewBox="0 0 100 125">
          <polygon
            fill="#5684a2"
            points="82.2,11.5 49.7,44 17.2,11.5 10.8,17.8 43.3,50.3 10.8,82.8 17.2,89.2 49.7,56.7 82.2,89.2 88.5,82.8 56,50.3    88.5,17.8  "
          />
        </svg>
      </a>
      <div class="top">
        <div class="username">
          <h2>{{ username }}</h2>
        </div>
        <div class="separator"/>
        <div class="report">
          <a
            href="javascript:void(0)"
            class="d-flex flex-row justify-content-start align-items-center"
          >
            <svg
              height="24"
              width="24"
              x="0px"
              y="0px"
              viewBox="0 0 100 125">
              <path
                fill="#aac343"
                d="M63.328,5.5H20.5c-3.309,0-6,2.691-6,6v76c0,3.309,2.691,6,6,6h58c3.309,0,6-2.691,6-6V26.672L63.328,5.5z M62.5,10.328  L79.672,27.5H64.5c-1.104,0-2-0.896-2-2V10.328z M78.5,89.5h-58c-1.104,0-2-0.896-2-2v-76c0-1.104,0.896-2,2-2h38v16  c0,3.309,2.691,6,6,6h16v56C80.5,88.604,79.604,89.5,78.5,89.5z"
              />
            </svg>
            <span>Report History</span>
          </a>
        </div>
        <div class="separator"/>
        <el-tree
          :data="bookmarkFolder"
          :props="defaultProps"
          node-key="id"
          accordion
          default-expand-all
        >
          <span
            slot-scope="{ node, data }"
            :class="{ 'bookmark-tree__empty' : data.isFolder && node.childNodes.length == 0 }"
            class="bookmark-tree"
          >
            <img
              v-if=" node.expanded && data.isFolder && node.childNodes.length > 0"
              :src="triangleOpenIcon"
              class="bookmark-tree-icon__open"
              alt
            >
            <img
              v-if=" !node.expanded && data.isFolder && node.childNodes.length > 0"
              :src="triangleClosedIcon"
              class="bookmark-tree-icon__closed"
              alt
            >
            <img
              v-if="data.isFolder"
              :src="folderIcon"
              class="bookmark-tree-icon"
              alt="">
            <a
              :href="data.url"
              class="bookmark-name">{{ data.name }}</a>
            <img
              v-if=" node.expanded && data.isTitle"
              :src="triangleOpenIcon"
              class="bookmark-tree-icon__title"
              alt
            >
            <img
              v-if=" !node.expanded && data.isTitle"
              :src="triangleClosedIcon"
              class="bookmark-tree-icon__title"
              alt
            >
            <span v-if="!data.isTitle">
              <el-button
                class="bookmark-tree-edit-button"
                type="text"
                size="mini"
                @click="() => handleOpenClick(data, 'editBookmark')"
              >Edit</el-button>
            </span>
          </span>
        </el-tree>
        <div class="new-bookmark">
          <div class="separator separator__green"/>
          <div
            class="new-bookmark-button"
            @click="handleOpenClick({}, 'newBookmark')">
            <img
              :src="newIcon"
              class="new-bookmark-button-icon"
              alt="">
            <span class="new-bookmark-button-text">New Bookmark</span>
          </div>
        </div>
      </div>
      <div class="bottom">
        <div class="help">
          <p class="text-uppercase">Need Help?</p>
          <p class="strong">Contact support</p>
          <p>+351 962323544</p>
          <p>
            <a href="mailto:mail@tesselo.com">mail@tesselo.com</a>
          </p>
        </div>
        <div
          class="logout"
          @click="logout">
          <div class="separator"/>
          <a
            href="javascript:void(0)">Logout</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

import BookmarksModal from "@/components/bookmarks-modal/bookmarks-modal.vue";

export default {
  name: "UserSidebar",
  components: {
    BookmarksModal
  },
  data() {
    return {
      open: false,
      iconHamburgerUrl:
        process.env.ASSETS_PUBLIC_PATH + "static/icons/hamburger.svg",
      folderIcon:
        process.env.ASSETS_PUBLIC_PATH + "static/icons/folder-white.svg",
      triangleOpenIcon:
        process.env.ASSETS_PUBLIC_PATH + "static/icons/triangle-open.svg",
      triangleClosedIcon:
        process.env.ASSETS_PUBLIC_PATH + "static/icons/triangle-closed.svg",
      newIcon: process.env.ASSETS_PUBLIC_PATH + "static/icons/icon-new.svg",
      defaultProps: [{
        children: "children",
        label: "name"
      }]
    };
  },

  computed: {
    ...mapState({
      authenticated: state => state.auth.authenticated,
      username: state => state.auth.username,
      bookmarkFolder: state => state.bookmarkFolder.bookmarkFolder
    })
  },

  methods: {
    openSidebar() {
      this.open = true;
    },

    closeSidebar() {
      this.open = false;
    },

    logout() {
      this.open = false;
      this.$router.push({ name: "Logout" });
    },

    /**
     * Emit open Modal
     *
     * @param data {null} if new, bookmark {data} if edit
     * @param typeModal {string} with type of action
     */
    handleOpenClick(data, typeModal) {
      this.$emit("showModal", typeModal, data);
    },
  }
};
</script>

<style lang="scss">
.user-sidebar-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: z("sidebar");
  width: 100vw;
  height: 100%;

  @media (min-width: 768px) {
    overflow: hidden;
  }

  pointer-events: none;
}

.user-sidebar {
  position: relative;
  z-index: 2;
  width: 300px;
  background-color: black;
  pointer-events: all;
  height: 100%;
  color: white;
  padding: 40px 20px;

  @media (max-width: 768px) {
    overflow-y: scroll;
  }

  transform: translateX(-100%);
  will-change: transform;
  backface-visibility: hidden;

  transition: transform 300ms ease-out;

  &--open {
    transform: translateX(0);
  }
}

.close {
  position: absolute;
  top: 20px;
  right: 20px;

  svg polygon {
    fill: white;
  }
}

.separator {
  width: 100%;
  height: 1px;
  background-color: rgba(white, 0.3);

  &__green {
    margin-bottom: 15px;
    background-color: #aac243;
  }
}

.top {
  width: 80%;

  .separator {
    margin-top: 15px;
  }

  div.el-tree {
    outline: none;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    width: 260px;

    .bookmark-tree {
      width: 260px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &-icon__title {
        float: right;
        margin-right: 10px;
      }

      .bookmark-name {
        width: 182px;
        height: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-decoration: none;
        color: white;
      }

      .bookmark-tree-icon__closed {
        margin-right: 4px;
      }

      &-edit-button {
        font-size: 13px;
        font-weight: bold;
        line-height: 1;
        text-align: right;
        color: #aac243;
      }
    }

    > div:nth-child(1) {
      margin-top: 10px;

      > div:nth-child(1) {
        background-color: #333;
        width: 272px;
        height: 42px;
        border-radius: 1.5px;
        margin: 0 20px 0 0;

        .bookmark-tree {
          height: 42px;
        }

        .bookmark-name {
          width: 182px;
          height: 20px;
          padding-left: 20px;
          font-size: 15px;
          font-weight: bold;
          color: #fff;
        }
      }
    }

    .el-tree-node {
      background-color: #1a1a1a;
      margin-top: 22px;
      width: 272px;
      border-radius: 1.5px;

      .el-tree-node__content {
        padding-left: 9px !important;
      }

      > .el-tree-node__children {
        .el-tree-node {
          width: 230px;
          margin-top: 12px;

          .bookmark-tree__empty {
            width: 240px;
            margin-left: 20px;
          }

          > .el-tree-node__children {
            padding-left: 42px;

            .bookmark-tree {
              width: 218px;

              &__empty {
                background-color: #aac243;
              }
            }
          }
        }
      }
    }

    .el-icon-caret-right {
      display: none;
    }
  }

  .new-bookmark {
    width: 272px;
    // height: 82px;
    height: 74px;
    background-color: #1a1a1a;
    border-radius: 1.5px;
    padding-top: 15px;
    padding-top: 8px;

    &-button {
      display: flex;
      align-items: center;

      &-icon {
        margin-left: 10px;
        margin-right: 8px;
      }

      &-text {
        font-size: 14px;
        font-weight: 600;
        line-height: 0.93;
        color: #aac243;
      }
    }
  }
}

.username {
  display: block;
  width: 80%;

  font-size: 19px;
  color: white;
}

.report {
  width: 100%;
  padding-left: 10px;

  .separator {
    margin-top: 192px;
  }

  a {
    margin-top: 20px;
    text-decoration: none;

    span {
      margin-top: -4px;
      margin-left: 2px;
      font-size: 14px;
      color: $booger;
    }
  }
}

.bottom {
  width: 100%;
}

.logout {
  width: 100%;
  margin-bottom: 28px;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }

  .separator {
    margin-bottom: 7px;
  }

  &:hover {
    text-decoration: underline;
    color: lighten($booger, 15%);
  }

  a {
    text-decoration: none;
    font-weight: bold;
    font-size: 14px;
    color: $booger;
  }
}

.help {
  margin-top: 47px;
  margin-bottom: 30px;

  @media (min-width: 768px) {
    margin-top: 0;
    margin-bottom: 2px;
  }

  p {
    font-size: 15px;
    line-height: 24px;

    letter-spacing: 0.4px;

    &.strong {
      font-weight: bold;
    }
  }

  a {
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      color: darken(white, 10%);
    }
  }
}

.open {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 70px;
  height: 50px;

  cursor: pointer;
  pointer-events: all;

  img {
    width: 40px;
    height: 40px;
  }
}
</style>
