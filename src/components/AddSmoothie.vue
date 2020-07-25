<template>
  <div class="add-smoothie container">
    <div v-if="isLoading" class="progress">
      <div class="indeterminate pink"></div>
    </div>
    <h2 v-if="!isLoading" class="center-align indigo-text">
      {{ isEditing ? `Editing ${this.smoothie.title}` : 'New Smoothie Recipe' }}
    </h2>
    <form v-if="!isLoading" @submit.prevent="submitSmoothie">
      <div class="field title">
        <label for="title">Smoothie Title</label>
        <input type="text" name="title" v-model="smoothie.title" />
      </div>
      <div>
        <div
          v-for="ingredient in smoothie.ingredients"
          :key="ingredient"
          class="chip"
        >
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
          v-model="anotherIngredient"
        />
      </div>
      <div class="field center-align">
        <p v-if="feedback" class="red-text">{{ feedback }}</p>
        <button class="btn pink">
          {{ isEditing ? 'Update Smoothie' : 'Add Smoothie' }}
        </button>
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
      isLoading: false,
      isEditing: false,
      smoothie: {
        id: null,
        title: '',
        ingredients: [],
      },
      anotherIngredient: null,
      feedback: null,
    }
  },
  computed: {
    slug: function() {
      return slugify(this.smoothie.title, {
        replacement: '-',
        remove: /[$*_+~.()\-:@]/g,
        lower: true,
      })
    },
  },
  methods: {
    addIngredient() {
      if (this.anotherIngredient) {
        this.smoothie.ingredients.push(this.anotherIngredient)
        this.anotherIngredient = null
        this.feedback = null
      } else {
        this.feedback = 'You must enter a value too add an ingredient'
      }
    },
    removeIngredient(ingredient) {
      this.smoothie.ingredients = this.smoothie.ingredients.filter(
        ing => ing !== ingredient
      )
    },
    addSmoothie() {
      if (this.smoothie.title && this.smoothie.ingredients.length !== 0) {
        db.collection('smoothies')
          .add({
            title: this.smoothie.title,
            slug: this.slug,
            ingredients: this.smoothie.ingredients,
          })
          .then(() => {
            this.$router.push({ name: 'Index' })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.feedback =
          'You must provide a title and at least one Ingredient before submitting'
      }
    },
    updateSmoothie() {
      if (this.smoothie.title && this.smoothie.ingredients.length !== 0) {
        db.collection('smoothies')
          .doc(this.smoothie.id)
          .update({
            title: this.smoothie.title,
            slug: this.slug,
            ingredients: this.smoothie.ingredients,
          })
          .then(() => {
            this.$router.push({ name: 'Index' })
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.feedback =
          'You must provide a title and at least one Ingredient before submitting'
      }
    },
    submitSmoothie() {
      this.isEditing ? this.updateSmoothie() : this.addSmoothie()
    },
  },
  created() {
    this.isLoading = true
    let ref = db
      .collection('smoothies')
      .where('slug', '==', this.$route.params.smoothie_slug || null)
    ref.get().then(snapshot => {
      snapshot.forEach(doc => {
        this.smoothie = doc.data()
        this.smoothie.id = doc.id
        this.isEditing = true
      })
      this.isLoading = false
    })
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
