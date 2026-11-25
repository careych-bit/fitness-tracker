<template>
  <body class="TitleBody">
    <header class="title">
      <span class="brand-icon">F</span>
      <h1 class="title">Track-Fit</h1>
      <span>The fitness tracking website</span>
    </header>
    <div class="side left">
      <ul>
        <li>
          <img>
          <span>Create workouts</span>
        </li>
        <li>
          <img>
          <span>Set goals</span>
        </li>
        <li>
          <img>
          <span>Track progress</span>
        </li>
      </ul>
    </div>
    <div class="side right">
      <img id="gym-image" src="../assets/Gym-bro.svg" alt="Illustration of people at the gym">
      <span>Login or Sign up</span>
      <a href="https://storyset.com/sport">Sport illustrations by Storyset</a>
    </div>
  </body>
</template>

<style scoped>

body.TitleBody {
  background-color: #F9FAEF;
  display: block;
  margin: 0;
  padding: 1em;
  padding-bottom: 3em;
  overflow: auto;
}
 
/* https://www.w3schools.com/howto/howto_css_split_screen.asp */
.side {
  height: 100%;
  width: 50%;
  position: fixed;
}

div.left {
  left: 0;
  background: lightblue;
}

div.right {
  right: 0;
  background: darkblue;  
}

#gym-image {
  margin: 2em;
  padding: 1em;
  border-radius: 20%;
  background: #2A4866;
}

header.title {
  display: flex;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #527b60;
  color: white;
  border-radius: 9px;
  font-size: 20px;
}

</style>
