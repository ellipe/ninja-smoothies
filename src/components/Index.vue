<template>
  <div class="index container">
    <div class="card" v-for="smoothie in smoothies" :key="smoothie.id">
      <i class="material-icons delete" @click="deleteSmoothie(smoothie.id)"
        >delete</i
      >
      <div class="card-content">
        <h2 class="indigo-text">{{ smoothie.title }}</h2>
        <ul class="ingredients">
          <li v-for="(ing, index) in smoothie.ingredients" :key="index">
            <span class="chip">{{ ing }}</span>
          </li>
        </ul>
      </div>

      <router-link
        :to="{
          name: 'EditSmoothie',
          params: { smoothie_slug: smoothie.slug },
        }"
      >
        <span class="btn-floating btn-large halfway-fab pink">
          <i class="material-icons edit">edit</i>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import db from '../firebase/init'

export default {
  name: 'Index',
  data() {
    return {
      smoothies: [],
    }
  },
  methods: {
    deleteSmoothie(id) {
      db.collection('smoothies')
        .doc(id)
        .delete()
        .then(() => {
          this.smoothies = this.smoothies.filter(smoothie => smoothie.id !== id)
        })
    },
  },
  created() {
    db.collection('smoothies')
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.smoothies.push({
            id: doc.id,
            ...doc.data(),
          })
        })
      })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.index {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 30px;
  margin-top: 60px;
}

.index h2 {
  font-size: 1.8em;
  text-align: center;
  margin-top: 0;
}

.index .ingredients {
  margin: 30px auto;
}

.index .ingredients li {
  display: inline-block;
}

.index .delete {
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  color: #aaa;
  font-size: 1.4em;
}

.index .delete:hover {
  color: rgb(212, 96, 96);
}

.edit:hover {
  background-color: #c2185b;
}
</style>
