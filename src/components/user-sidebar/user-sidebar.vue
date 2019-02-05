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
    <div :class="['user-sidebar d-flex flex-column justify-content-between align-items-start', { 'user-sidebar--open': open }]">
      <a
        href="javascript:void(0)"
        class="close"
        @click="closeSidebar"
      >
        <svg
          width="24"
          height="24"
          x="0px"
          y="0px"
          viewBox="0 0 100 125">
          <polygon
            fill="#FFFFFF"
            points="82.2,11.5 49.7,44 17.2,11.5 10.8,17.8 43.3,50.3 10.8,82.8 17.2,89.2 49.7,56.7 82.2,89.2 88.5,82.8 56,50.3    88.5,17.8  "
          />
        </svg>
      </a>
      <div class="top">
        <div class="username">
          <h2>{{ username }}</h2>
        </div>
        <div class="separator" />
        <div class="report">
          <a
            href="javascript:void(0)"
            class="d-flex flex-row justify-content-start align-items-center">
            <svg
              height="24"
              width="24"
              x="0px"
              y="0px"
              viewBox="0 0 100 125" >
              <path
                fill="#aac343"
                d="M63.328,5.5H20.5c-3.309,0-6,2.691-6,6v76c0,3.309,2.691,6,6,6h58c3.309,0,6-2.691,6-6V26.672L63.328,5.5z M62.5,10.328  L79.672,27.5H64.5c-1.104,0-2-0.896-2-2V10.328z M78.5,89.5h-58c-1.104,0-2-0.896-2-2v-76c0-1.104,0.896-2,2-2h38v16  c0,3.309,2.691,6,6,6h16v56C80.5,88.604,79.604,89.5,78.5,89.5z" />
            </svg>
            <span>Report History</span>
          </a>
        </div>
      </div>
      <div class="bottom">
        <div class="help">
          <p class="text-uppercase">Need Help?</p>
          <p class="strong">Contact support</p>
          <p>+351 962323544</p>
          <p><a href="mailto:mail@tesselo.com">mail@tesselo.com</a></p>
        </div>
        <div
          class="logout"
          @click="logout"
        >
          <div class="separator" />
          <a href="javascript:void(0)">Logout</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'UserSidebar',
  data() {
    return {
      open: false,
      iconHamburgerUrl: process.env.ASSETS_PUBLIC_PATH + 'static/icons/hamburger.svg'
    }
  },
  computed: {
    ...mapState({
      authenticated: state => state.auth.authenticated,
      username: state => state.auth.username
    })
  },
  methods: {
    openSidebar() {
      this.open = true
    },
    closeSidebar() {
      this.open = false
    },
    logout() {
      this.open = false
      this.$router.push({ name: 'Logout' })
    },
  }
}
</script>

<style lang="scss" scoped>
  .user-sidebar-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: z('sidebar');
    width: 100vw;
    height: 100vh;

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

  .top {
    width: 80%;

    .separator {
      margin-top: 15px;
    }
  }

  .username {
    display: block;
    width: 80%;

    font-size: 19px;
    color: white;
  }

  .separator {
    width: 100%;
    height: 1px;
    background-color: rgba(white, 0.3);
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

  .help {
    margin-top: 82px;
    margin-bottom: 30px;

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

  .bottom {
    width: 100%;
  }

  .logout {
    width: 100%;

    .separator {
      margin-bottom: 20px;
    }

    a {
      text-decoration: none;
      font-weight: bold;
      font-size: 14px;
      color: $booger;
    }

    &:hover {
      text-decoration: underline;
      color: lighten($booger, 15%);
    }
  }

  .open {
    position: absolute;
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
