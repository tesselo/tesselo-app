<template>
  <div class="main-container">
    <router-view :key="$route.path"/>
    <user-sidebar
      @showModal="handleShowModal" />
    <bookmarks-modal
      v-if="showModal"
      :bookmark="bookmark"
      :bookmark-folder="bookmarkFolder"
      :type-input="typeOfAction"
      @closeModal="handleCloseModal"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { actionTypes } from '@/services/constants'
import UserSidebar from '@/components/user-sidebar/user-sidebar'
import BookmarksModal from '@/components/bookmarks-modal/bookmarks-modal.vue'

export default {
  name: 'App',
  components: {
    UserSidebar,
    BookmarksModal
  },

  data() {
    return {
      showModal: false,
      bookmark: [{
        name: 'Bookmarks',
        isFolder: false,
        isTitle: true,
        children: []
      }],
      typeOfAction: ''
    }
  },

  computed: {
    ...mapState({
      bookmarkFolder: state => state.bookmarkFolder.bookmarkFolder,
      authenticated: state => state.auth.authenticated
    })

  },

  watch: {
    authenticated(isAuthenticated) {
      if(isAuthenticated)
        this.getBookmarkFolderAction()
    }
  },

  mounted() {
    this.authStart()
  },

  methods: {
    ...mapActions('auth', {
      authStart: actionTypes.AUTH_START,
    }),
    ...mapActions("bookmarkFolder", {
      getBookmarkFolderAction: actionTypes.BOOKMARK_FOLDER_GET
    }),

    /**
     * Receive event to close bookmark modal
     */
    handleCloseModal() {
      this.showModal = false
    },

    handleShowModal(typeOfAction, data) {
      this.showModal = true
      this.typeOfAction = typeOfAction
      if(typeOfAction =='newBookmark') {
        this.bookmark = {
          bookmarkfolder: '',
          description:"",
          name:"",
          url:"",
        }
      } else{
       this.bookmark = data
      }
    }
  },
  beforeUnmount() {
    console.log('beforeUnmount has been called')
  },
  unmounted() {
    console.log('unmounted has been called')
  }
}
</script>
<style lang="scss" >
  .main-container {
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }

  .el-select-dropdown__item {
    &.selected {
      color: #606266 !important;
    }

    &:not(.created) {
      ::after {
        float: right;
        display: flex;
        align-items: center;
        color: $twilight-blue;
        content: (url("/src/assets/images/icons/icon-new-blue.svg") "\a0New Folder ");
      }

      &.selected {
        color: #606266 !important;
      }
    }
}
</style>