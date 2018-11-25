// Constants used for AI distinction between how to act during the trump selection process and the real game
const INITIAL_SELECTION_PROCESS = 0;
const SECONDARY_SELECTION_PROCESS = 1;
const REAL_GAME = 2;

// For AI initial selection process
const PASS = 3;
const PICKITUP = 4;

// For AI secondary selection process
const SPADES = 100;
const CLUBS = 101;
const HEARTS = 102;
const DIAMONDS = 103;

var player, opponent1, partner, opponent2;
var players = [];
var names = ["Athena","Bill","Sally","Logan","Megan","Tom","Alex","Olivia","Jesse","Annie","Josie","Krystal","Nicole","Jordan","ATP","Abby","Hannah"];

var cards = ["9S", "10S", "JS", "QS", "KS", "AS", "9C", "10C", "JC", "QC", "KC", "AC", "9H", "10H", "JH", "QH", "KH", "AH", "9D", "10D", "JD", "QD", "KD", "AD"];

var availableCards = cards;
var discardCards = [];
var cardUp;

var dealerIndex = -1;
var currentPlayerIndex = 0;

// For the while loop break to work
var playerCanSelect = true;
var playerPickUp = "";

function Playable(name) {
  var hand = [];
  this.name = name;
}

function setup() {
  player = new Playable("JC");
  opponent1 = new Playable(getRandomName());
  partner = new Playable(getRandomName());
  opponent2 = new Playable(getRandomName());
  players = [player,opponent1,partner,opponent2];

  console.log("You're playing with "+partner.name+", and against "+opponent1.name+" and "+opponent2.name);

  newRound();
}

function getAIResponse(type) {
  // FIXME: Make as clean as SECONDARY_SELECTION_PROCESS, fix the 10 problem w/ substring!

  if (type == INITIAL_SELECTION_PROCESS) {
    // Make it easier to tell which card is the left
    var left;
    if (cardUp.substring(1) == "S") {
      left = "JC";
    }
    else if (cardUp.substring(1) == "C") {
      left = "JS";
    }
    else if (cardUp.substring(1) == "H") {
      left = "JD";
    }
    else {
      left = "JH";
    }

    // To check which cards match the suit of cardUp
    var matchingCards = [];

    // First, check how many cards match the suit of cardUp
    for (var i = 0; i < players[currentPlayerIndex].hand.length; i++) {
      if (players[currentPlayerIndex].hand[i].substring(1) == cardUp.substring(1) || players[currentPlayerIndex].hand[i] == left) {
        matchingCards.push(players[currentPlayerIndex].hand[i]);
      }
    }

    // If 3 or more cards match, check how high their values are-- if one is higher than a king, pick it up. otherwise, pass.
    if (matchingCards.length >= 3) {
      for (var i = 0; i < matchingCards.length; i++) {
        if (players[currentPlayerIndex].hand[i].substring(0,1) == "A" || players[currentPlayerIndex].hand[i].substring(0,1) == "J") {
          return PICKITUP;
        }
      }
    }
    // If 2 or more cards match, check how high their values are-- if one is higher than a queen AND they are the dealer, pick it up. If cardUp is the right, pick it up. otherwise, pass.
    else if (matchingCards.length >= 2 && dealerIndex == currentPlayerIndex) {
      for (var i = 0; i < matchingCards.length; i++) {
        if (players[currentPlayerIndex].hand[i].substring(0,1) == "K" || players[currentPlayerIndex].hand[i].substring(0,1) == "A" || players[currentPlayerIndex].hand[i].substring(0,1) == "J" || cardUp.substring(0,1) == "J") {
          return PICKITUP;
        }
      }
    }
    // If 2 or more cards match, check how high gheir values are---if one is higher than a king AND opponent2 is the dealer, pick it up. Otherwise, pass.
    else if (matchingCards.length >= 2 && dealerIndex%2 == currentPlayerIndex%2) {
      for (var i = 0; i < matchingCards.length; i++) {
        if (players[currentPlayerIndex].hand[i].substring(0,1) == "A" || players[currentPlayerIndex].hand[i].substring(0,1) == "J") {
          return PICKITUP;
        }
      }
    }
    // Nothing worked out!
    else {
      console.log("Player "+players[currentPlayerIndex].name+": Pass");
      return PASS;
    }
  }
  else if (type == SECONDARY_SELECTION_PROCESS) {

    // Make it easier to tell which card is the left
    var suitSubsets = [[],[],[],[]];

    // First, divide your hand by suit for later comparison
    for (var i = 0; i < players[currentPlayerIndex].hand.length; i++) {

      var card = players[currentPlayerIndex].hand[i];
      var cardSuit = (card.includes("10")) ? card.substring(2) : card.substring(1);

      if (cardSuit == "S" || card == "JC") {
        suitSubsets[0].push(card);
      }
      if (cardSuit == "C" || card == "JS") {
        suitSubsets[1].push(card);
      }
      if (cardSuit == "H" || card == "JD") {
        suitSubsets[2].push(card);
      }
      if (cardSuit == "D" || card == "JH") {
        suitSubsets[3].push(card);
      }
    }

    // FIXME: make work pls

    console.log(suitSubsets);

    for (var j = 0; j < suitSubsets.length; j++) {
      if (suitSubsets[j].length == 3) {
        console.log("test");
      }
    }
  }
  else {
    console.log("eh");
  }
}

function getRandomName() {
  var newNameIndex = floor(random(names.length));
  var returnName = names[newNameIndex];
  names.splice(newNameIndex,1);
  return returnName;
}

function updateDealerIndex() {
  (dealerIndex < 3) ? dealerIndex++ : dealerindex=0;
}

function updateCurrentPlayerIndex() {
  (dealerIndex < 3) ? currentPlayerIndex = dealerIndex + 1 : currentPlayerIndex = 0;
}

function getNewHand() {
  var newHand = [];
  while (newHand.length < 5) {
    var tempCard = round(random(availableCards.length-1));
    if (!newHand.includes(availableCards[tempCard])) {
      newHand.push(availableCards[tempCard]);
      availableCards.splice(tempCard,1);
    }
  }
  console.log(newHand);
  return newHand;
}

function newRound() {
  // Reset hands + discard pile
  availableCards = cards;
  for (var i=0; i<players.length; i++) {
    players[i].hand = getNewHand();
  }

  discardCards = availableCards;
  console.log(discardCards);

  // What could be trump
  cardUp = discardCards[0];

  // Update who's the dealer / current player
  updateDealerIndex();
  updateCurrentPlayerIndex();

  // Give textual information
  console.log("The card up is: "+cardUp);

  // Get AI responses for pre-game if necessary
  while (currentPlayerIndex != 0) {
    if (getAIResponse(INITIAL_SELECTION_PROCESS) == PICKITUP) {
      console.log("Player "+players[currentPlayerIndex].name+": Pick it up!");
      playerCanSelect = false;
      break;
    }
    (currentPlayerIndex < 3) ? currentPlayerIndex++ : currentPlayerIndex = 0;
  }

  // Letting the player select if an AI hasn't picked it up
  if (playerCanSelect) {
    var specificWord = (dealerIndex == 0) ? "pick" : "order";

    do {
      playerPickUp = prompt("Will you "+specificWord+" it up? (Y/N)");
    } while (playerPickUp != "Y" && playerPickUp != "N");

    (playerPickUp == "N") ? console.log("Player "+players[currentPlayerIndex].name+": Pass") : console.log("Player "+players[currentPlayerIndex].name+": Pick it up!");

    // Important for secondary selection process AND if player picks it up
    currentPlayerIndex++;
  }

  // If the player said no, go to round 2 of the selection process
  if (playerPickUp == "N") {

    while (currentPlayerIndex != 0) {
      if (getAIResponse(SECONDARY_SELECTION_PROCESS) >= 100) {
        console.log("Player "+players[currentPlayerIndex].name+": AAAAA");
        playerCanSelect = false;
        break;
      }
      (currentPlayerIndex < 3) ? currentPlayerIndex++ : currentPlayerIndex = 0;
    }
  }


  // Get ready for the real game
  updateCurrentPlayerIndex();
/*

  CODE FRAGMENT -- Asking the player for what card to play

*/
  // var test;
  // do {
  //   test = prompt("");
  // } while (!player.hand.includes(test));
  //
  // console.log(test);
}
