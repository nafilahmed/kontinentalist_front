import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuth = defineStore('auth', () => {

  const token = ref(localStorage.getItem("token"));
  // const user = ref(JSON.parse(localStorage.getItem("user")));

  function setToken(tokenValue) {
    localStorage.setItem('token', tokenValue);
    token.value = tokenValue;
  }

  // function setUser(userValue) {
  //   localStorage.setItem('user', JSON.stringify(userValue));
  //   user.value = userValue;
  // }

  const isAuthenticated = computed(() => {
      return token.value;
  })

  // const fullName = computed(() => {
  //   if (user.value) {
  //     return user.value.firstName + ' ' + user.value.lastName;
  //   }
  //   return '';
  // })

  async function checkToken() {
    try {
      const tokenAuth = 'Bearer ' + token.value;
        
      console.log(tokenAuth)

      const { data } = await http.get("/auth/verify", {
        headers: {
          Authorization: tokenAuth,
        },
      });
      return data;
    } catch (error) {
      console.log(error.response.data);
    }
  }

  function clear() {
    localStorage.removeItem('token');
    // localStorage.removeItem('user');
    token.value = '';
    // user.value = '';
  }

  return {
    token,
    // user,
    setToken,
    // setUser,
    checkToken,
    isAuthenticated,
    // fullName,
    clear
  }

})