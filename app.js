// // declare variables for page elements we'll need to access
const submitButton = document.getElementById('btn');
const infoForm = document.getElementById('dino-compare');
const infoGrid = document.getElementById('grid');

// // Create Dino Constructor
const DinoConstructor = function(
    species, weight, height, diet, habitat, period, fact,
) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.habitat = habitat;
  this.period = period;
  this.facts = [fact]; // needs to be an array with multiple facts
  this.image = `./images/${species.toLowerCase()}.png`;
};

// // Create 3 Dino comparison methods. Compare height, weight, and diet
// then add facts to fact array of dino object
DinoConstructor.prototype.compareHeight = function(height) {
  let fact;
  if (this.height < height) {
    fact = `You are ${height - this.height} inches taller than this dino was!`;
  } else if (this.height > height) {
    fact = `This dino was ${this.height - height} inches taller than you!`;
  } else {
    fact = 'You and this dino would\'ve been equal in height!';
  };

  this.facts.push(fact);
};

DinoConstructor.prototype.compareWeight = function(weight) {
  let fact;
  if (this.weight < weight) {
    fact = `You are ${weight - this.weight} pounds heavier than this dino was!`;
  } else if (this.weight > weight) {
    fact = `This dino was ${this.weight - weight} pounds heavier than you!`;
  } else {
    fact = 'You and this dino would\'ve been equal in weight!';
  };

  this.facts.push(fact);
};

DinoConstructor.prototype.compareDiet = function(diet) {
  let fact;
  if (this.diet === diet) {
    fact = 'This dino had the same diet as you!';
  } else {
    fact = `This dino's diet was ${this.diet}, and you're a ${diet}.`;
  }

  this.facts.push(fact);
};

// // Create Human Constructor
const HumanConstructor = function(name, height, weight, diet) {
  this.name = name;
  this.height = height;
  this.weight = weight;
  this.diet = diet;
};

// // build array of dino objects
// first declare an array to hold data
let dinoArray = [];

// use fetch to get data from json, then populate array with new dino objects
fetch('dino.json')
    .then((response) => response.json())
    .then((data) => dinoArray = data.Dinos.map((dino) => new DinoConstructor(
        dino.species, dino.weight, dino.height, dino.diet, dino.where,
        dino.when, dino.fact,
    )));


// // Use IIFE to get human data from form
// define helper function to get data from each form field
const getFormField = function(field) {
  const data = document.getElementById(field);
  return data;
};

// define IIFE that uses helper function to get human data from form
// then use data to create human object
const getHumanData = function() {
  return (function() {
    const name = getFormField('name').value;
    const heightFt = getFormField('feet').value;
    const heightIn = getFormField('inches').value;
    const totalHeight = parseInt(heightFt) * 12 + parseInt(heightIn);
    const weight = parseInt(getFormField('weight').value);
    const diet = getFormField('diet').value;

    const human = new HumanConstructor(name, totalHeight, weight, diet);

    return human;
  })();
};

// // Generate Tiles for each Dino in Array
// declare function that creates a tile out of dino info
const dinoTile = function(dinoInfo) {
  // don't choose fact if Pigeon, else choose random fact from facts array
  const factPicker = dinoInfo.species === 'Pigeon' ? 0 : Math.round(Math.random() * 3);

  const newDiv = document.createElement('div');

  // use provided css class names and h3 tags
  newDiv.className = 'grid-item';
  newDiv.innerHTML = `<h3>${dinoInfo.species}</h3><img src='${dinoInfo.image}'><p>${dinoInfo.facts[factPicker]}</p>`;

  return newDiv;
};

// declare function that creates a tile out of human info
const humanTile = function(humanInfo) {
  const newDiv = document.createElement('div');

  // use provided css class names and h3 tags
  newDiv.className = 'grid-item';
  newDiv.innerHTML = `<h3>${humanInfo.name}</h3><img src='./images/human.png'>`;

  return newDiv;
};


// On button click, prepare and display infographic
submitButton.addEventListener('click', function(event) {
  event.preventDefault();
  infoForm.style.display = 'none';
  const human = getHumanData();

  // insert human into dino array at 4th index
  dinoArray.splice(4, 0, human);

  // append facts to dino object fact arrays (except Pigeon and Human)
  dinoArray.forEach((dino) => {
    // check if Pigeon, if so then leave facts alone. else, add 3 facts
    if (dino.species === 'Pigeon' || dino.name) {
    } else {
      dino.compareHeight(human.height);
      dino.compareWeight(human.weight);
      dino.compareDiet(human.diet.toLowerCase());
    }
  });

  // create container for info tiles
  const tileContainer = document.createDocumentFragment();

  // 9 total tiles, human has to be in the middle (4th index)
  // generate tiles for each animal
  for (let i = 0; i < 9; i++) {
    const gridTile = i === 4 ? humanTile(human) : dinoTile(dinoArray[i]);
    tileContainer.appendChild(gridTile);
  };

  // append tiles to DOM
  infoGrid.appendChild(tileContainer);
});
