<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'Home' }" class="logo">
      <img :src="require('@/assets/img/logo.png')" />
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul v-if="user">
        <li class="navbar-user">
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

export default {
  data () {
    return {
      isDropdownOpen: false
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/authUser'
    })
  },
  methods: {
    useDefaultAvatar (e) {
      e.target.src = require('@/assets/img/user.png')
    }
  }
}
</script>
