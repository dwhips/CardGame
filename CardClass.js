// Classes that builds and manages cards and players

  //This card class stores details about every card.
  class CardData{
    name;
    details;
    pictureLink;

    //Card Effect Properties
    totalStealCards = 0;
    totalDrawCards = 0;
    //TODO need other properties about the card specifics (draw from deck, steal card, drink, etc). Need to break apart card functionality into the card contructor
    //Properties would best be setup like
    //this.TotalDrawCount >> Normally 0, but if set then draw one card.
    //this.TotalStealCard >> 0 - x, steal x cards (then a bool to see if you can steal from multiple players)
//And all of this would be evaluated on the cards Play() function to know what to do.

    constructor(strName, strDetails)
    {
        this.name = strName;
        this.details = strDetails;
        // this.pictureLink = strPictureLink;
    }

    //TODO make all class getters have this _ bit for standards
    _name() {return this.name;}
    _details(){return this.details;}
    _totalStealCards(){return this.totalStealCards;}
    _totalDrawCards(){return this.totalDrawCards;}

    setPicture(strPictureLink){
        this.pictureLink = strPictureLink;
    }

    SetStealCards(nTotalStealCards){
        this.totalStealCards = nTotalStealCards;
    }

    SetDrawCards(lngTotalDrawCards){
        this.totalDrawCards = lngTotalDrawCards;
    }

    printDetails()
    {
        console.log("card name: " + this.name);
        console.log("card details: " + this.details);
    }
  }

class PlayerData{
    name;
    playersHand = [];
    playersTableHand = []; //TODO pending what is the easiest way to manage this// This would be the cards played by a plyer (if they need to be on the table)

    constructor(strPlayerName)
    {
        this.name = strPlayerName;
    }

    getName(){
        return this.name;
    }

    getPlayersHand()
    {
        return this.playersHand;
    }

    addCardToHand(objCard)
    {
        this.playersHand.push(objCard);
    }

    iGetCard(iCard){
        if (iCard < 1) return;
        if (this.playersHand.length < iCard) throw new Error("Cannot get [" + iCard + "] from the players hand: " + this.playersHand.length);

        return this.playersHand[iCard];
    }

    printPlayerCardList()
    {
        console.log("Showing card hand for player: " + this.getName())
        this.playersHand.forEach((card) => {
            card.printDetails();
        });
    }
}

 class CardManager{
    deckCardList = [];
    playerList = [];
    playerStartHandCount;
    iCurrentPlayer;

    constructor(lngPlayerStartHand)
    {
        this.playerStartHandCount = lngPlayerStartHand;
        // this.startGame(); //Need to populate cards first
    }

    addPlayer(strPlayerName){

        if (strPlayerName == "") throw new Error("Adding a new player name cannot be empty");
        // TODO should check if the name is already used 

        this.playerList.push(new PlayerData(strPlayerName))
    }

    addNewCard(strName, strDetails, count, totalStealCards = 0, totalDrawCards = 0)
    {
        for (let i = 0; i < count; i++)
        {
            // console.log("I am adding a card" + strName + ": #" + count)
            let objCardData = new CardData(strName, strDetails);
            objCardData.SetDrawCards(totalDrawCards);
            objCardData.SetStealCards(totalStealCards);

            this.deckCardList.push(objCardData);

        }
    }

    getCardFromDeck(iCard){
        return this.deckCardList[iCard];
    }

    getCurrentPlayer()
    {
        console.log("Getting current player: " + this.iCurrentPlayer);
        return this.iCurrentPlayer;
    }

    findPlayerByName(strName)
    {
        for (let iPlayer = 0; iPlayer < this.playerList.length; iPlayer++) {
            if (this.playerList[iPlayer].name === strName){
                // console.log("Found [" + strName + ": " + iPlayer + "] in findPlayerByName");
                return iPlayer;
            }
        }
        throw new Error("Failed to find player [" + strName + "] in the player list");
    }

    getPlayerNameByIndex(iFindPlayer)
    {
        for (let iPlayer = 0; iPlayer < this.playerList.length; iPlayer++) {
            if (iPlayer === iFindPlayer){
                return this.playerList[iPlayer].name;
            }
        }
        throw new Error("Failed to find player [" + iFindPlayer + "] in the player list. List size: " + this.playerList.length);
    }

    shuffleDeck(){
        shuffleArray(this.deckCardList);
    }

    getTotalPlayers(){
        return this.playerList.length;
    }

    drawCard(iPlayer){
        if (iPlayer == null)
        {
            iPlayer = this.getCurrentPlayer();
        }

        if (this.deckCardList.length == 0)
        {
            throw new Error("The deck is empty, failed to draw a card");
        }

        var objCard = this.deckCardList.pop();
        this.playerList[iPlayer].addCardToHand(objCard);
        console.log("/////////Drawing card "+ objCard.name +" for player : " + iPlayer);
    }

    stealCard(iPlayerThief, iPlayerVictim){
        //Getting a random card from victim
        if (this.playerList[iPlayerVictim].playersHand.length === 0) {
            throw new Error("Cannot steal from target player [" + iPlayerVictim + "] who doesnt have any more cards" );
        }
        const j = randomInt(this.playerList[iPlayerVictim].playersHand.length);
        var objStolenCard =  this.playerList[iPlayerVictim].playersHand.splice(j, 1)[0];
        this.playerList[iPlayerThief].addCardToHand(objStolenCard);
        
    }

    startGame(){
        //intial setup
        this.iCurrentPlayer = 0;
        this.shuffleDeck(); 

        //Dealing cards to players
        this.initialDeal();
    }

    nextPlayer(){
        this.iCurrentPlayer++;
        if (this.iCurrentPlayer >= this.getTotalPlayers())
        {
            this.iCurrentPlayer = 0;
        }
    }

    initialDeal()
    {
        var totalCardsToDeal = this.playerList.length * this.playerStartHandCount;
        console.log("Total cards to deal: " + totalCardsToDeal);

        if (totalCardsToDeal > this.deckCardList.length) throw new Error("Trying to draw " + totalCardsToDeal + " from " + this.deckCardList.length + " cards.");

        for(var iPlayer = 0; iPlayer < this.playerList.length; iPlayer++)
        {
            for (var iPlayerCard = 0; iPlayerCard < this.playerStartHandCount; iPlayerCard++)
            {
                this.drawCard(iPlayer);
            }
            // this.playerList[iPlayer].printPlayerCardList();
        }
    }
 }
  

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function randomInt(max){
    var test  = Math.floor(Math.random() * max);
    console.log(test);
    return test;
}