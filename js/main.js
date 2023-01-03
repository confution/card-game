


let deckId = ''




//need to check if previous deckId exists, then expose button to allow user to continue game 
if(localStorage.getItem('deckID')){
  document.querySelector('#cont').style = ""
  console.log('Previous deck found')
}

//if user want to continue previous game, load the deck and insert players points, and cards on DOM
document.querySelector('#cont').addEventListener('click', contGame)
function contGame(){
  hideNewUnhideMain()
  setPointsDom()
  console.log('Player chose to continue previous game')
}

//if user want to start a new game or no previous game in localStorage
document.getElementById('new').addEventListener('click', newGame)
function newGame(){
  localStorage.clear()
  hideNewUnhideMain()
  getNewDeck()
  console.log('New deck drawn')
  localStorage.setItem('points1', 0)
  localStorage.setItem('points2', 0)
  setPointsDom()
  console.log('Player chose to start new game, beginning new game.')
}


//hide new game menu unhide main
function hideNewUnhideMain(){
  document.querySelector('#menu').style = 'display:none'
  document.querySelector('main').style = ''
}


//placing points value into DOM
function setPointsDom(){
  document.querySelector('.points1').innerText = localStorage.getItem('points1')
  document.querySelector('.points2').innerText = localStorage.getItem('points2') 
}

// function checkRemaining(deckId){
//   const url = `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
//   fetch(url)
//     .then(res => res.json())
//     .then(data => {
//       console.log(data)
//       return data.remaining
//     })
// }

//getting new deck of cards
function getNewDeck(){
  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
  .then(res => res.json())
  .then(data =>{
    console.log(data)
    deckId = data.deck_id
    localStorage.setItem('deckID', data.deck_id)
    document.querySelector('#remain').innerText = data.remaining
  })
  .catch(err => console.log(`error ${err}`))
}

//convert faced cards to values
function valToNum(val){
  if(val === 'ACE') {
    return 14
  } else if(val === 'KING') {
    return 13
  } else if(val === 'QUEEN') {
    return 12
  } else if(val === 'JACK') {
    return 11
  } else {
    return Number(val)
  }
}

//creating an eventlistener for when user wants to deal a new hand
document.querySelector('#dealBtn').addEventListener('click', drawCards(2))

//drawing new cards
function drawCards(num){
  const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`
  if(!cardCount){
    let cardCount = num
  } else {
    cardCount+=num
  }
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data)
      let p1CardVal = valToNum(data.cards[0].value)
      let p2CardVal =  valToNum(data.cards[1].value)
      document.querySelector('#player1').src = data.cards[0].image
      document.querySelector('#player2').src = data.cards[1].image
      document.querySelector('#remain').innerText = data.remaining
    })

  if(p1CardVal === p2CardVal){
    drawCards(4)
  }else{
    setResult(p1CardVal , p2CardVal, cardCount)
    setPointsDom()
  }
}

// function draw4Cards(){
//   const url = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4`
//   fetch(url)
//     .then(res => res.json())
//     .then(data => {
//       console.log(data)
//       localStorage.setItem('p1CardVal',  valToNum(data.cards[1].value))
//       localStorage.setItem('p2CardVal',  valToNum(data.cards[3].value))
//       document.querySelector('#player1').src = data.cards[1].image
//       document.querySelector('#player2').src = data.cards[3].image
//       document.querySelector('#remain').innerText = data.remaining
//     })
//   setResult((localStorage.getItem('p1CardVal')), (localStorage.getItem('p2CardVal')) , 4)
// }


//calculates winner and sets
function setResult( p1Val, p2Val, pointsToAdd ){
   if(p1Val > p2Val){
    let sum = Number(localStorage.getItem('points1')) + pointsToAdd
    localStorage.setItem('points1', sum)
    console.log(`${pointsToAdd} points added to Player 1's total`)
  } else{
    let sum = Number(localStorage.getItem('points2')) + pointsToAdd
    localStorage.setItem('points2', sum)
    console.log(`${pointsToAdd} points added to Player 2's total`)
  }
}
