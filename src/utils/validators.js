import firebase from 'firebase'
import store from '@/store'

const uniqueEmail = value => {
  if (value === '') return true
  if (value === store.getters['auth/authUser'].email) return true

  return new Promise((resolve, reject) => {
    firebase.database().ref('users')
      .orderByChild('email').equalTo(value.toLowerCase())
      .once('value', snapshot => {
        resolve(!snapshot.exists())
      })
  })
}

const uniqueUsername = value => {
  if (value === '') return true
  if (value === store.getters['auth/authUser'].username) return true

  return new Promise((resolve, reject) => {
    firebase.database().ref('users')
      .orderByChild('usernameLower').equalTo(value.toLowerCase())
      .once('value', snapshot => {
        resolve(!snapshot.exists())
      })
  })
}

const supportedImageFile = value => {
  if (value === '') return true

  const supported = ['jpg', 'jpeg', 'png', 'gif', 'svg']
  const suffix = value.split('.').pop()
  return supported.includes(suffix)
}

const responseOk = value => {
  if (value === '') return true
  return new Promise((resolve, reject) => {
    fetch(value)
      .then(response => resolve(response.ok))
      .catch(() => resolve(false))
  })
}

export { uniqueUsername, uniqueEmail, supportedImageFile, responseOk }
