<template>
  <header class="header" id="header" v-click-outside="closeMobileNav" v-handle-scroll="closeMobileNav">
    <router-link :to="{ name: 'Home' }" class="logo">
      <img :src="require('@/assets/img/logo.png')" />
    </router-link>

    <div class="btn-hamburger" @click="isMobileNavOpen = !isMobileNavOpen">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <nav class="navbar" :class="{'navbar-open': isMobileNavOpen}">
      <ul v-if="user">
        <li class="navbar-user" v-click-outside="closeUserDropdown">
          <a @click.prevent="isDropdownOpen = !isDropdownOpen">
            <img
              @error="useDefaultAvatar"
              class="avatar-small"
              :src="user.avatar"
              :alt="user.name"
            />
            <span>
              {{user.name}}
              <img class="icon-profile" :src="require('@/assets/img/arrow-profile.svg')" alt />
            </span>
          </a>

          <!-- dropdown menu -->
          <div id="user-dropdown" :class="{ 'active-drop': isDropdownOpen}">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link router-link :to="{name: 'Profile'}">
                  View profile
                </router-link>
              </li>
              <li class="dropdown-menu-item">
                <a @click.prevent="$store.dispatch('auth/logOut')">Log out</a>
              </li>
            </ul>
          </div>
        </li>
        <li class="navbar-mobile-item">
          <router-link router-link :to="{name: 'Profile'}">
            View profile
          </router-link>
        </li>
        <li class="navbar-mobile-item">
          <a @click.prevent="$store.dispatch('auth/logOut')">Log out</a>
        </li>
      </ul>
      <ul v-else>
        <li class="navbar-item">
          <router-link :to="{name: 'Login'}">Log In</router-link>
        </li>
        <li class="navbar-item">
          <router-link :to="{name: 'Register' }">Register</router-link>
        </li>
      </ul>

    </nav>
  </header>
</template>
<script>
import { mapGetters } from 'vuex'
import clickOutside from '@/directives/click-outside'
import handleScroll from '@/directives/handle-scroll'

export default {
  data () {
    return {
      isDropdownOpen: false,
      isMobileNavOpen: false
    }
  },
  directives: {
    clickOutside,
    handleScroll
  },
  computed: {
    ...mapGetters({
      user: 'auth/authUser'
    })
  },
  methods: {
    useDefaultAvatar (e) {
      e.target.src = require('@/assets/img/user.png')
    },
    closeUserDropdown () {
      this.isDropdownOpen = false
    },
    closeMobileNav () {
      this.isMobileNavOpen = false
    }
  }
}
</script>
