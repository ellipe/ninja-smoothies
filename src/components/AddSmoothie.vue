<template>
  <div class="add-smoothie container">
    <h2 class="center-align indigo-text">
      New Smoothie Recipe
    </h2>
    <form @submit.prevent="addSmoothie">
      <div class="field title">
        <label for="title">Smoothie Title</label>
        <input type="text" name="title" v-model="title" />
      </div>
      <div>
        <div v-for="ingredient in ingredients" :key="ingredient" class="chip">
          {{ ingredient }}
          <i class="close material-icons" @click="removeIngredient(ingredient)"
            >close</i
          >
        </div>
      </div>
      <div class="field add-ingredient">
        <label for="add-ingredient">Add Ingredient</label>
        <input
          type="text"
          name="add-ingredient"
          @keydown.tab.prevent="addIngredient"
          v-model="another"
        />
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">Add Smoothie</button>
      </div>
    </form>
  </div>
</template>

<script>
import db from '@/firebase/init'
import slugify from 'slugify'

export default {
  name: 'AddSmoothie',
  data() {
    return {
      title: null,
      ingredients: [],
      another: null,
      feedback: null,
    }
  },
  computed: {
    slug: function() {
      return slugify(this.title, {
        replacement: '-',
        remove: /[$*_+~.()\-:@]/g,
        lower: true,
      })
    },
  },
  methods: {
    addIngredient() {
      if (this.another) {
        this.ingredients.push(this.another)
        console.log('DEBUG:::::::::::::::::::::: ingredients', this.ingredients)
        this.another = null
        this.feedback = null
      } else {
        this.feedback = 'You must enter a value too add an ingredient'
      }
    },
    removeIngredient(ingredient) {
      this.ingredients = this.ingredients.filter(ing => ing !== ingredient)
    },
    addSmoothie() {
      if (this.title && this.ingredients.length !== 0) {
        db.collection('smoothies')
          .add({
            title: this.title,
            slug: this.slug,
            ingredients: this.ingredients,
          })
          .then(() => {
            this.$router.push({ name: 'Index' })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.feedback =
          'You must provide a Title and at least one Ingredient before submitting'
      }
    },
  },
}
</script>

<style>
.add-smoothie {
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
}

.add-smoothie h2 {
  font-size: 2em;
  margin: 20px auto;
}

.add-smoothie .field {
  margin: 20px auto;
}
</style>
