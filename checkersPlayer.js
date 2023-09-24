function player(playerName, playerDirection, playerBoard, playerRole){
    this.playerName = playerName;
    this.playerScore = 0;
    this.playerDirection = playerDirection;
    this.playerBoard = playerBoard;
    this.playerRole = playerRole;
    this.playerKeepAlive = 50;
    this.playerStillCanEat = [];
    this.getPlayerPawns = function() {
        playerPawns = [];
        for (let i=0; i<this.playerBoard.boardPawns.length; i++){
            if (this.playerBoard.boardPawns[i].player == this){
                playerPawns.push(this.playerBoard.boardPawns[i]);
            }
        }
        return playerPawns;
    }
    this.playerHasPawnCanEat = function(){
        pawnCanEat = [];
        if (this.playerStillCanEat.length == 0){
            playerPawnArray = this.getPlayerPawns();
            for (let j=0; j<playerPawnArray.length; j++){
                if (playerPawnArray[j].canEat().length > 0){
                    pawnCanEat.push([playerPawnArray[j].pawnLogicalX,playerPawnArray[j].pawnLogicalY]);
                }
            }
        } else {
            pawnCanEat = this.playerStillCanEat;
        }
        return pawnCanEat;
    }
}