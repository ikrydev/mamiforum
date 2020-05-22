<template>
  <header class="header col-full" id="header">
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
      <ul>
        <li class="navbar-user">
          <a href="#">
            <img
              class="avatar-small"
              src="https://i.imgur.com/WPSrfGm.jpg"
              alt
            />
            <span>
              Alex Kyriakidis
              <img class="icon-profile" :src="require('@/assets/img/arrow-profile.svg')" alt />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <a href="#">View profile</a>
              </li>
              <li class="dropdown-menu-item">
                <a href="#">Log out</a>
              </li>
            </ul>
          </div>
        </li>
      </ul>

    </nav>
  </header>
</template>
