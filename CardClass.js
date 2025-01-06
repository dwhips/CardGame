// Classes that builds and manages cards and players

  //This card class stores details about every card.
  class CardData{
    name;
    details;
    pictureLink;

    constructor(strName, strDetails)
    {
        this.name = strName;
        this.details = strDetails;
    }

    _name() {return this.name;}
    _details(){return this.details}

    setPicture(strPictureLink){
        this.pictureLink = strPictureLink;
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

    constructor(strName)
    {
        this.name = strName;
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
        this.playerList.push(new PlayerData(strPlayerName))
    }

    addNewCard(strName, strDetails, count){
        //loop count times, add to a list
        var i;
        for (i = 0; i < count; i++)
        {
            // console.log("I am adding a card" + strName + ": #" + count)
            this.deckCardList.push(new CardData(strName, strDetails));
        }
    }

    getCardFromList(iCard){
        return this.deckCardList[iCard];
    }

    getCurrentPlayer()
    {
        return this.iCurrentPlayer;
    }

    shuffleDeck(){
        shuffleArray(this.deckCardList);
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

        var testCard = this.deckCardList.pop();
        this.playerList[iPlayer].addCardToHand(testCard);
        console.log("/////////Drawing card "+ testCard.name +" for player : " + iPlayer);

        //TODO dont want to actually remove card from master list, just a test
        // var testCard = this.fullCardList.pop();

        // //Giving card to the current player
        // var topCard = this.getTopOfDeck();

        // //TODO!!!!!!!!!!!!!!!!!!!!!!!!
        // //Need to pull the top card that is in the deck, not just the top card
        // this.fullCardList[topCard].sendToPlayer(iPlayer);
    }

    //This is the position of the card on top of the deck 
    //TODO not sure about this way, it seems pretty messy
    //Trying to purge thi
    // getTopOfDeck(){
    //     for(var iCard = 0; iCard < this.fullCardList.length--; iCard++)
    //     {
    //         // var objCard = this.fullCardList[iCard];
    //         // console.log("testin pullin out obj");

    //         // console.log(objCard._location());
    //         if (this.getCardFromList(iCard)._location() == CardLocation.Deck) {
    //             console.log("The top card is " + iCard + ". Printing details.");
    //             this.getCardFromList(iCard).printDetails();
    //             return iCard;
    //         }
    //     }
    // }

    startGame(){
        //intial setup
        this.iCurrentPlayer = 0;
        this.shuffleDeck(); 

        //Dealing cards to players
        this.initialDeal();
    }

    initialDeal()
    {
        var totalCardsToDeal = this.playerList.length * this.playerStartHandCount;
        console.log("Total cards to deal: " + totalCardsToDeal);

        if (totalCardsToDeal > this.deckCardList.length) throw new error("Trying to draw " + totalCardsToDeal + " from " + this.deckCardList.length + " cards.");

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