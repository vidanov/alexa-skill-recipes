'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = undefined;

/***********
Data: Customize the data below as you please.
***********/

const SKILL_NAME = "Five Minute Recipes";
const HELP_MESSAGE = "I know how to make tasty meals in less than 5 minutes.";
const HELP_REPROMPT = "Just ask me for a recipe.";
const STOP_MESSAGE = "Fine. Eat something else then.";

const CHOOSE_TYPE_MESSAGE = "Welcome to 5 minute recipes! I know some cool foods. What kind of recipe are you looking for?";
const REPROMPT_TYPE = "You can choose a breakfast, lunch, snack or dinner recipe.";
const MEALTYPE_NOT_IN_LIST = chosenType => `Sorry, I couldn't find any recipes for ${chosenType}. Do you want a breakfast, lunch, dinner or snack recipe?`;

const SUGGEST_RECIPE = recipeName => `I found this awesome ${recipeName} recipe! Do you want me to tell you how to make ${recipeName}?`;
const MISUNDERSTOOD_RECIPE_ANSWER = "Please answer with either yes or no.";

const FIRST_TIME_INSTRUCTIONS = "Say 'next' to go to the next line of instructions. Say 'repeat' if you didn't understand me or want to hear the last instructions again.";
const MISUNDERSTOOD_INSTRUCTIONS_ANSWER = "Sorry I didn't understand you there.";
const CLOSING_MESSAGE = "Wonderful. Hope you have a great meal or as the Germans say: Guten Appetit!";

const recipes = {
  breakfast: [
    {
      name: "P B and J",
      instructions: [
        "You'll need some sandwhich bread, peanut butter and jelly of your choosing.",
        "Find some sandwich bread.",
        "Spread a thick layer of peanut butter onto the bread.",
        "Dump a huge spoon of jelly on top of the peanut butter and spread it.",
        "There you go! You just made a delicious peanut butter jelly sandwich. Goodbye."
      ]
    },
    {
      name: "Cereal",
      instructions: [
        "You'll need some milk and cereal.",
        "Get a bowl",
        "Fill it half-way with cereal.",
        "Now fill up the rest of the bowl with milk.",
        "Mmmmmh. This is going to be some gooood breakfast."
      ]
    },
    {
      name: "Bacon and Eggs",
      instructions: [
        "For this recipe you will need to buy some simple frying oil, four strips of bacon and two eggs.",
        "Spread a thin layer of oil on a pan and start heating it on the stove.",
        "Throw the bacon strips into the pan and wait until the bacon is significantly darker and crispy.",
        "Take out the bacon and put it aside. Get the eggs, open them and gently let their content into the pan.",
        "The eggs are done when all the egg white has become fully white and the yoke is still slightly liquid.",
        "Bam! That's what I call some sweet, awesome breakfast!"
      ]
    }
  ],
  lunch: [
    {
      name: "Potatoes and broccoli",
      instructions: [
        "You'll need some potatoes and broccoli for this... and of course water. But I don't think I need to mention that.",
        "Fill two pots with water, place them on the stove and turn up the heat all the way. Once the water is boiling put the potatoes in one pot and the broccoli in the other.",
        "Now, wait until the potatoes and broccoli have exactly the consistency you like.",
        "Excellent! This is some gooood eating."
      ]
    },
    {
      name: "Sandwich",
      instructions: [
        "Call Subway and order a sandwich you really like.",
        "Wait until they deliver it. Maybe do some situps. That's really good for your body. So I've heard.",
        "Once the sandwich deliverer arrives rejoice! You just did something good for your body."
      ]
    },
    {
      name: "Brolied Lobster Tails with Garlic and Chili Butter",
      instructions: [
        "You know, several weeks ago I was in Europe. I tell you, that's really a continent worth seeing. So many different and cool countries.",
        "Germany, France, Poland, Italy, ... So much to see.",
        "Oh right... Brolied Lobster Tails with Garlic and Chili Butter. You don't really don't think you can do that in 5 minutes, right?",
        "Well you can't."
      ]
    }
  ],
  dinner: [
    {
      name: "Frozen Pizza",
      instructions: [
        "Did you know you don't even need to make your own pizza anymore these days? Incredible! Go and buy some!",
        "Preheat the oven at 180 degrees celcius. If you don't know what that is in Fahrenheit you really should think about your life. Because most countries in the world use celcius. So go ahead and learn it.",
        "Once the oven is preheated put the pizza in there. But without the plastic wrap! That's really not fun to eat. I tell you, I knew a guy... but that's a story for another time.",
        "After 10 to 15 minutes take the pizza out of the oven. If you're really hard core you can wait 20 minutes. I've heard burned pizza is not as unhealthy as people might think."
      ]
    },
    {
      name: "Ice cream",
      instructions: [
        "Seriously? This was a joke! Who eats ice cream for dinner? But fine. I guess you do. So for this recipe you need ice cream.",
        "Open your freezer, get the ice cream and a small spoon. Only weird people use big spoons to eat ice cream. Don't be weird.",
        "Enjoy the ice cream. Don't take too big bites! That would potentially be really bad."
      ]
    },
    {
      name: "Steak and fries",
      instructions: [
        "Excellent choice! You'll need a fresh steak and some frozen fries.",
        "Preheat the oven and once it's done preheating put the fries in there.",
        "Use a black pan and start heating it up.",
        "Put the steak in the heated pan and shortly sear it from both sides.",
        "Now, turn down the heat on the stove and keep frying the steak for as long as you want. It really depends on how medium or well done you like your steak. So it's kind of hard for me to tell you how long to fry it. Just do what your heart tells you to do.",
        "Perfect. This is some really fancy meal."
      ]
    }
  ],
  snack: [
    {
      name: "Chips",
      instructions: [
        "Go to the closest supermarket and buy a bag of chips",
        "Open the bag.",
        "Enjoy!"
      ]
    },
    {
      name: "Banana",
      instructions: [
        "If you happen to live in the jungle, you might find a banana on a tree somewhere. If you don't, you might have to go to a market close by.",
        "Pick a yellow banana. Don't pick a green banana. Those have to sit for a while before being eatable. And we want this recipe to be done within 5 minutes. So seriously, don't screw this up. Pick a yellow banana!",
        "Feeling like a monkey today? Well that's important sometimes, too."
      ]
    },
    {
      name: "Beef Jerkey",
      instructions: [
        "Now, this is a tricky one. Are you sure you want to eat beef jerkey? I'm not sure if that's really a good idea. But fine. Whatever you want. Just go to a grocery store and buy some.",
        "Great! Now hold your breath! You don't want to breathe in while opening a bag of beef jerkey. That's really not nice. So quick, wrip open the bag. Wait for 10 seconds and then walk into a different room with the open bag.",
        "Now, you may breathe again. But don't go crazy. The smell is still there. It's just not as strong. Have fun eating."
      ]
    }
  ]
};

/***********
Execution Code: Avoid editing the code below if you don't know JavaScript.
***********/

const states = {
  STARTMODE: "_STARTMODE",
  RECIPEMODE: "_RECIPEMODE",
  INSTRUCTIONSMODE: "_INSTRUCTIONSMODE"
};

const newSessionhandlers = {
  'NewSession': function(){
    this.handler.state = states.STARTMODE;
    this.emit(':ask', CHOOSE_TYPE_MESSAGE, REPROMPT_TYPE);
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask', HELP_MESSAGE, HELP_REPROMPT);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell', STOP_MESSAGE);
  }
};

const startModeHandlers = Alexa.CreateStateHandler(states.STARTMODE, {
  'NewSession': function(){
    this.handler.state = '';
    this.emitWithState('NewSession');
  },
  'ChooseTypeIntent': function(){
    const chosenType = this.event.request.intent.slots.mealType.value;

    if(Object.keys(recipes).includes(chosenType)){
      this.attributes['mealType'] = chosenType;
      this.handler.state = states.RECIPEMODE;
      this.emitWithState("Recipe");
    }else{
      this.emit(':ask', MEALTYPE_NOT_IN_LIST(chosenType));
    }
  },
  'Unhandled': function(){
    this.emit(':ask', REPROMPT_TYPE);
  }
});

const recipeModeHandlers = Alexa.CreateStateHandler(states.RECIPEMODE, {
  'Recipe': function(){
    const allRecipes = recipes[this.attributes['mealType']];
    this.attributes['recipe'] = allRecipes[Math.floor(Math.random()*allRecipes.length)]; // Select a random recipe
    this.emit(':ask', SUGGEST_RECIPE(this.attributes['recipe'].name));
  },
  'AMAZON.YesIntent': function(){
    this.attributes['instructions'] = this.attributes['recipe'].instructions;
    this.attributes['current_step'] = 0;
    this.handler.state = states.INSTRUCTIONSMODE;
    this.emitWithState('InstructionsIntent');
  },
  'AMAZON.NoIntent': function(){
    this.emitWithState('Recipe');
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_RECIPE_ANSWER);
  }
});

const instructionsModeHandlers = Alexa.CreateStateHandler(states.INSTRUCTIONSMODE, {
  'InstructionsIntent': function(){
    const currentStep = this.attributes['instructions'][this.attributes['current_step']];
    const firstTimeInstructions = (this.attributes['current_step'] == 0) ? FIRST_TIME_INSTRUCTIONS : '';
    this.emit(':ask', `${currentStep} ${firstTimeInstructions}`);
  },
  'NextStepIntent': function(){
    this.attributes['current_step']++;

    if(this.attributes['current_step'] < this.attributes['instructions'].length){
      this.emitWithState('InstructionsIntent');
    }else{
      this.emitWithState('InstructionsEnded');
    }
  },
  'InstructionsEnded': function(){
    this.emit(':tell', CLOSING_MESSAGE);
  },
  'Unhandled': function(){
    this.emit(':ask', MISUNDERSTOOD_INSTRUCTIONS_ANSWER);
  }
});

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context);
  alexa.APP_ID = APP_ID;
  alexa.registerHandlers(newSessionhandlers, startModeHandlers, recipeModeHandlers, instructionsModeHandlers);
  alexa.execute();
};
