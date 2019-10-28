<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div
        :class="{'modal-container__folder' : bookmark.isFolder == true, 'modal-container__delete' : confirmDelete == true,}"
        class="modal-container">
        <div class="modal-header">
          <span
            class="modal-header-title">{{ getTitle() }}</span>
          <a
            class="close__modal"
            @click="$emit('closeModal')">
            <svg
              width="24"
              height="24"
              x="0px"
              y="0px"
              viewBox="0 0 100 125">
              <polygon
                fill="#0e405b"
                points="82.2,11.5 49.7,44 17.2,11.5 10.8,17.8 43.3,50.3 10.8,82.8 17.2,89.2 49.7,56.7 82.2,89.2 88.5,82.8 56,50.3    88.5,17.8  "
              />
            </svg>
          </a>
        </div>

        <div
          :class="{'modal-body__delete' : confirmDelete == true}"
          class="modal-body">
          <el-form
            v-if="confirmDelete==false"
            ref="formData"
            :model="newBookmark"
            :rules="rules"
            label-position="top">
            <div class="row">
              <el-form-item
                :class="{'column__folder' : bookmark.isFolder == true, 'column': !isTouch}"
                prop="name">
                <label
                  class="modal-body-text">Bookmark Name</label>
                <el-input
                  v-model="newBookmark.name"
                  :value="newBookmark.name"
                  :class="{'modal-body-input__folder' : bookmark.isFolder == true}"
                  class="modal-body-input modal-body-input-margin"
                  placeholder="Bookmark Name"
                  @change="value => bookmark.name = value"
                />
              </el-form-item>
              <el-form-item
                v-if="!isTouch && newBookmark.isFolder==false || !isTouch && !newBookmark.isFolder "
                prop="folderId"
                class="column">
                <label
                  class="modal-body-text">Folder</label>
                <el-select
                  v-model="newBookmark.bookmarkfolder"
                  class="modal-body-input-margin"
                  placeholder="Folder"
                  filterable
                  allow-create
                  @change="value => newBookmark.bookmarkfolder = value"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    class="created"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div
              v-if="isTouch"
              class="row">
              <el-form-item
                v-if="newBookmark.isFolder==false || !newBookmark.isFolder || !isTouch"
                prop="folderId">
                <label
                  class="modal-body-text">Folder</label>
                <el-select
                  v-model="newBookmark.bookmarkfolder"
                  class="modal-body-input-margin modal-input-mobile"
                  placeholder="Folder"
                  filterable
                  allow-create
                  @change="value => newBookmark.bookmarkfolder = value"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    class="created"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <div
            v-if="confirmDelete==true"
            class="confirm-delete-text"
            v-html="getDeleteMessage()"> {{ getDeleteMessage() }}</div>
        </div>

        <div
          :class="{'modal-footer__delete' : confirmDelete == true}"
          class="modal-footer">
          <span
            v-if="confirmDelete==false"
            name="footer">
            <button
              v-if="typeInput=='editBookmark'"
              :class="{'row' : isTouch}"
              class="modal-button__delete"
              @click="confirmDelete=true"
            >Delete Bookmark</button>
            <button
              v-if="!isTouch"
              class="modal-button"
              @click="$emit('closeModal')">Cancel</button>
            <button
              v-if="!isTouch"
              class="modal-button__save"
              @click="save()">Save Bookmark</button>
            <div
              v-if="isTouch"
              class="row">
              <button
                class="modal-button"
                @click="$emit('closeModal')">Cancel</button>
              <button
                class="modal-button__save"
                @click="save()">Save Bookmark</button>
            </div>
          </span>
          <span
            v-if="confirmDelete==true"
            name="footer">
            <button
              class="modal-button"
              @click="$emit('closeModal')">Cancel</button>
            <button
              class="modal-button__confirm"
              @click="deleteItem()">Delete</button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { actionTypes } from "@/services/constants";

export default {
  name: "BookmarkModal",
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    typeInput: {
      type: String,
      default: "newBookmark"
    },
    bookmark: {
      type: Object,
      default: null
    },
    bookmarkFolder: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      input: "",
      options: this.bookmarkFolder ? this.bookmarkFolder[0].children : [],
      loading: false,
      confirmDelete: false,
      newBookmark: this.bookmark,
      previousFolder: this.bookmark.bookmarkfolder,
      rules: {
        name: [
          {
            required: true,
            trigger: "submit",
            message: "Name is required"
          }
        ],
        folderId: [
          {
            required: true,
            trigger: "submit",
            message: "Bookmark folder is required",

            validator: (rule, value, callback) => {
              let valid = true;
              if (this.bookmark.isFolder == true || (!this.bookmark.isFolder && this.bookmark.bookmarkfolder)) {
                valid = true
              } else {
                valid = false
              }

              if (!valid) {
                callback(new Error("Option required"));
              } else {
                callback();
              }
            }
          }
        ]
      }
    };
  },

  computed: {
    isTouch() {
      return this.$deviceInfo.isTouch;
    }
  },
  methods: {
    ...mapActions("bookmarkFolder", {
      saveBookmarkFolderAction: actionTypes.BOOKMARK_FOLDER_SAVE,
      getBookmarkFolderAction: actionTypes.BOOKMARK_FOLDER_GET,
      editBookmarkFolderAction: actionTypes.BOOKMARK_FOLDER_EDIT,
      deleteBookmarkFolderAction: actionTypes.BOOKMARK_FOLDER_DELETE
    }),
    ...mapActions("bookmark", {
      saveBookmarkAction: actionTypes.BOOKMARK_SAVE,
      editBookmarkAction: actionTypes.BOOKMARK_EDIT,
      deleteBookmarkAction: actionTypes.BOOKMARK_DELETE
    }),

    getTitle(){
      if(this.typeInput == 'newBookmark'){
        return 'New Bookmark'
      } else {
        if(this.bookmark.isFolder){
          return 'Edit Bookmark Folder'
        } else {
          return 'Edit Bookmark'
        }
      }
    },
    getDeleteMessage(){
      if(this.bookmark.isFolder){
        return `<span style="font-size: 18px;">
                  <p style="font-weight: bold;">Are you sure you want to delete the folder?</p></br>
                  This will permanently delete all the bookmarks inside.
                </span>`
      }
        return `<span style="font-size: 18px;">
                  <p style="font-weight: bold;">Are you sure you want to delete the bookmark?</p></br>
                  This will permanently delete it
                </span>`
    },

    save() {
      this.loading = true;
      this.$refs.formData.validate(valid => {
        if (valid) {
          const exists = this.options.find(item => item.id == this.bookmark.bookmarkfolder);

          const bookmarkFolderData = {
            description: "",
            bookmarks: []
          }

          let bookmarkData = {
            name: this.bookmark.name,
            description: "",
            url: window.location.href,
            bookmarkfolder: exists ? exists.id : 0
          }

          this.bookmark.bookmarkfolder ? bookmarkData.bookmarkfolder = this.bookmark.bookmarkfolder : bookmarkData.bookmarkfolder = bookmarkData.bookmarkfolder
          this.bookmark.id ? bookmarkData.id = this.bookmark.id :  bookmarkData
          exists ? bookmarkFolderData.name = exists.name : bookmarkFolderData.name = this.bookmark.bookmarkfolder

          if (this.typeInput == "newBookmark") {
            this.saveBookmark(bookmarkFolderData, bookmarkData, exists)
          } else {
            if(this.bookmark.isFolder){
              this.updateBookmarkFolder(bookmarkFolderData)
            } else {
              this.updateBookmark(bookmarkFolderData, bookmarkData, exists)
            }
          }
        }
      });
    },

    /**
     * Save new bookmark handler
     */
    saveBookmark (bookmarkFolderData, bookmarkData, exists) {
      if (exists) {
        this.saveBookmarkAction(bookmarkData).then(() => {
          this.updateTreeList()
        })
      } else {
        this.saveBookmarkFolderAction(bookmarkFolderData).then((response) => {
          bookmarkData.bookmarkfolder = response.id;
          this.saveBookmarkAction(bookmarkData).then(() => {
            this.updateTreeList()
          })
        });
      }
    },

    /**
     * Update bookmark folder handler
     */
    updateBookmarkFolder(bookmarkFolderData){
      this.bookmark.id ? bookmarkFolderData.id = this.bookmark.id : bookmarkFolderData
      this.bookmark.name ? bookmarkFolderData.name = this.bookmark.name : bookmarkFolderData
      this.editBookmarkFolderAction(bookmarkFolderData).then(() => {
        this.updateTreeList()
      })
    },

    /**
     * Update bookmark handler
     */
    updateBookmark (bookmarkFolderData, bookmarkData, exists) {
      if (this.previousFolder === bookmarkData.bookmarkfolder || (this.previousFolder !== bookmarkData.bookmarkfolder && exists)) {
        this.editBookmarkAction(bookmarkData).then(() => {
          this.updateTreeList()
        })
      } else if (this.previousFolder !== bookmarkData.bookmarkfolder && !exists) {
        this.saveBookmarkFolderAction(bookmarkFolderData).then((response) => {
          bookmarkData.bookmarkfolder = response.id;
          this.editBookmarkAction(bookmarkData).then(() => {
            this.updateTreeList()
          })
        })
      }
      this.updateTreeList()
    },

    /**
     *  Delete handler
     */
    deleteItem() {
      this.loading = true;
      if(this.bookmark.isFolder){
        this.deleteBookmarkFolderAction(this.bookmark).then(() => {
          this.updateTreeList()
        })
      } else {
        this.deleteBookmarkAction(this.bookmark).then(() => {
          this.updateTreeList()
        })
      }
    },

    /**
     * Action to be made after edit or add in order to refresh the state
     */
    updateTreeList(){
      this.getBookmarkFolderAction().then(() => {
        this.loading = false;
        this.$emit('closeModal')
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 320px;
  height: 270px;
  margin: auto;
  padding: 30px 25px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;

  @media (min-width: 768px) {
    width: 670px;
    height: 270px;
  }

  &__folder {
    height: 324px;

    @media (min-width: 768px) {
      width: 670px;
      height: 269px;
    }
  }

  &__delete {
    height: 340px;

    @media (min-width: 768px) {
      height: 286px;
    }
  }
}

.modal-header {
  position: relative;
}

.modal-header-title {
  font-size: 24px;
  font-weight: 300;
  color: #5684a2;

  @media (min-width: 768px) {
    font-size: 28px;
  }
}

.modal-body-input {
  width: 100%;

  @media (min-width: 768px) {
    width: 295px;

    &__url {
      width: 100%;
    }
  }

  &-margin {
    margin-top: 10px;
  }
}

.modal-body {
  margin: 35px 0;

  &-text {
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #0e405b;
  }

  &__delete {
    margin: 54px 0;
  }

  .row {
    margin: 0;
    margin-bottom: 22px;

    @media (max-width: 768px) {
      margin-left: auto;
      margin-right: auto;
    }

    .modal-body-input {
      width: 270px;
      margin-right: 25px;

      @media (min-width: 768px) {
        width: 295px;
      }

      &-margin {
        margin-top: 10px;
      }

      &__folder {
        width: 100%;
      }
    }

    .column {
      width: 50%;

      &__folder {
        width: 100%;
      }
    }
  }

  .confirm-delete-text {
    margin: 35px 50px;
    text-align: center;
  }

  .el-select {
    display: flex;
    width: 100%;
    position: relative;
  }
}

.modal-input-mobile {
  width: 270px !important;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  align-content: left;
  margin-top: 38px;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }

  &__delete {
    justify-content: center;
  }
}

.modal-button {
  font-size: 14px;
  font-weight: bold;
  color: #8994ab;

  @media (max-width: 768px) {
    margin-right: 12px;
  }

  &__save {
    width: 141px;
    height: 42px;
    opacity: 0.3;
    border-radius: 4px;
    background-color: #0e405b;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    margin-right: 22px;
  }

  &__delete {
    color: $red;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 6px;

    @media (min-width: 768px) {
      margin-right: 270px;
      margin-bottom: 0;
    }
  }

  &__confirm {
    width: 141px;
    height: 42px;
    opacity: 0.3;
    border-radius: 4px;
    background-color: $red;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    margin-right: 22px;
  }
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

/deep/ .el-form-item {
  &__error {
    position: absolute;
    padding-top: 2px;
    font-size: 14px;
    font-weight: bold;
    color: $red;
  }
}

.new-bookmark {
  &-text {
    float: left;
  }
}

.close__modal {
  position: absolute;
  top: 0;
  right: 0;

  svg polygon {
    fill: $twilight-blue;
  }
}

</style>
