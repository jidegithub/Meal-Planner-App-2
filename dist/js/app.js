(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
let createForm = document.querySelector('#create-form');
let content = document.querySelector('main.content');
let clear = document.getElementById('clear')
const opt = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

function populate() {
  axios.get('/planner')
    .then((response) => {
      let plan = response.data.records;
      let output = '';
      plan.forEach(info => {
        output +=
          `
          <figure class="food--img-container">
          <div class="category">${info.fields.category}</div>
            <img src=${info.fields.image_link} alt="food-image" class="food--img food--img-1">
            <h3>${info.fields.name}</h3>
            <a href=${info.fields.recipe_link}>view recipe</a>
            <h5>${(new Date(info.fields.cook_date).toLocaleDateString('en-US', opt))}</h5>
          </figure>

        `
      })
      content.innerHTML = output
    })
}

//fetch content from airtable.com and render on the screen when the dom content has loaded
document.addEventListener('DOMContentLoaded', populate)



//create-form specifics
const name = document.querySelector('#name');
const category = document.querySelector('#category');
const recipe = document.querySelector('#recipe');
const cookDate = document.querySelector('#cookdate');
const image = document.querySelector('#image');
const apiKey = 'keyyxfDwNZrcMcpyD';
let items = [];

//global defaults for axios
axios.defaults.baseURL = 'https://api.airtable.com/v0/appB325T0iEK0I1Is/';
axios.defaults.headers.common['Authorization'] = `Bearer ${apiKey}`;
axios.defaults.headers.post['Content-Type'] = 'application/json';


//form submit event to post new recipe
createForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const newEntry = {
    name: name.value,
    category: `${category.options[category.selectedIndex].value}`,
    image_link: image.value,
    recipe_link: recipe.value,
    cook_date: cookDate.value
  };
  axios.post('/planner', {
    fields: newEntry,
    "typecast": true
  }).then((response) => {
    items.unshift(newEntry);
    console.log(items)
    alert(`successfully added 😆!`);
    name.value = '';
    category.value = '';
    image.value = '';
    recipe.value = '';
    cookDate.value = '';
  }).catch((err => {
    console.log(err)
  }));

  populate()
})

function runSearch() {
  const searchQuery = document.querySelector('#search').value;
  axios.get('/planner')
    .then((response) => {
      let recordsArr = response.data.records;
      const regExp = new RegExp(searchQuery, 'gi');
      let searchResult = recordsArr.filter(meal => {
        let mealName = meal.fields.name
        return !!mealName.match(regExp)
      })
      
      const resultArr = searchResult.map(result => (
        `
        <figure class="food--img-container">
          <div class="category">${result.fields.category}</div>
          <img src=${result.fields.image_link} alt="food-image" class="food--img food--img-1">
          <h3>${result.fields.name}</h3>
          <a href=${result.fields.recipe_link}>view recipe</a>
          <h5>${result.fields.cook_date}</h5>
        </figure>
      `
      ));
      content.innerHTML = resultArr.join('');
    })
}

clear.addEventListener('click', populate);
console.clear()
},{}]},{},[1])