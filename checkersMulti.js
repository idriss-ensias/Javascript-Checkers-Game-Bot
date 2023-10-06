function checkersMultiManager(multiBoard){
    this.multiBoard = multiBoard;
    this.gameident = gameID;
    this.multiSocket = null;
    this.gameState = 0;
    this.counter = 50;
    this.startButtonClicked = 0;
    this.clickedPawn = [];
    this.indicatorColor = "orange"
    this.init = function(){
        this.multiSocket = new WebSocket('ws://'+window.location.host+'/ws/game/'+this.gameident+'/');
        multiManager = this;
        this.multiSocket.onmessage = function(e) {
            data = JSON.parse(e.data);
            if (multiManager.gameState == 0){
                multiManager.gameStateZeroReceive(data["message"].split('.'));
            } else if (multiManager.gameState == 1){
                multiManager.gameStateOneReceive(data["message"].split('.'));
            } else if (multiManager.gameState == 2){
                multiManager.gameStateTwoReceive(data["message"].split('.'));
            }
        };
        this.multiSocket.onclose = function(e) {
            console.error('Tozzzzzzzzzz');
        };
    }
    this.update = function(){
        if (this.gameState == 0){
            this.gameStateZeroSend();
        } else if (this.gameState == 1){
            this.gameStateOneCheck();
        }
        ctx = checkersGameArea.context;
        ctx.fillStyle = "#D3D3D3";
        ctx.beginPath();
        ctx.arc(Math.floor(this.multiBoard.boardProportion/32),Math.floor(this.multiBoard.boardProportion/32),Math.floor((3*this.multiBoard.boardProportion)/160),0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = this.indicatorColor;
        ctx.beginPath();
        ctx.arc(Math.floor(this.multiBoard.boardProportion/32),Math.floor(this.multiBoard.boardProportion/32),Math.floor((3*this.multiBoard.boardProportion)/250),0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    this.gameStateZeroSend = function(){
        if (this.counter == 0){
            for (let af=0; af<playerGlobalList.length; af++){
                if (playerGlobalList[af][0] != miniMe){
                    if (playerGlobalList[af][1] == 0){
                        this.multiSocket.send('{"message":"0.'+miniMe+'.'+playerGlobalList[af][0]+'"}');
                    }
                }
            }
            this.counter = 50;
        } else {
            this.counter--;
        }
    }
    this.gameStateOneSend = function(){
        for(let ah=0; ah<playerGlobalList.length; ah++){
            if (playerGlobalList[ah][0] != miniMe){
                this.multiBoard.infoBoardMessage.messageText = "Waiting for "+playerGlobalList[ah][0]+" to press Start";
                this.multiBoard.infoBoardMessage.startDisabled = true;
                this.multiBoard.infoBoardMessage.startButtonColor = "gray";
                this.multiBoard.infoBoardMessage.update();
                this.multiSocket.send('{"message":"2.'+miniMe+'.'+playerGlobalList[ah][0]+'"}')
            }
        }
    }
    this.gameStateOneCheck = function(){
        if (playerGlobalList[0][1] == 2 ){
            if (playerGlobalList[1][1] == 2){
                this.multiBoard.infoBoardMessage.messageShow = 0;
                this.gameState = 2;
                this.multiBoard.gameStart = true;
                if (playerGlobalList[this.multiBoard.turn][0] == miniMe){
                    this.indicatorColor = "green";
                } else {
                    this.indicatorColor = "red";
                }
                this.multiBoard.update();
                this.update();
            }
        }
    }
    this.gameStateZeroReceive = function(message){
        if (message[0] == "0"){
            if (message[1] != miniMe){
                if (message[2] == miniMe){
                    this.multiSocket.send('{"message":"1.'+miniMe+'.'+message[1]+'"}');
                }
            }
        } else if (message[0] == "1"){
            playerGlobalList[getPlayerIndex(message[1],playerGlobalList)][1] = 1;
        }
        if (allPlayerOnline(playerGlobalList)){
            this.multiBoard.infoBoardMessage.messageText = "Ready to play, press Start";
            this.multiBoard.infoBoardMessage.enableStartButton();
            this.gameState = 1;
        }
    }
    this.gameStateOneReceive = function(message){
        if (message[0] == "2"){
            if (message[1] != miniMe){
                playerGlobalList[getPlayerIndex(message[1],playerGlobalList)][1] = 2;
            }
        }
    }
    this.gameStateTwoSend = function(){
        for (let al=0; al<playerGlobalList.length; al++){
            if (playerGlobalList[al][0] != miniMe) {
                this.multiSocket.send('{"message":"3.'+miniMe+'.'+playerGlobalList[al][0]+'.'+this.multiBoard.pawnListToString()+'.'+this.multiBoard.turn+'"}');
            }
        }
        if (playerGlobalList[this.multiBoard.turn][0] != miniMe){
            this.indicatorColor = "red";
        }
        this.update();
    }
    this.gameStateTwoSendClip = function(pawnID){
        for (let an=0; an<playerGlobalList.length; an++){
            if(playerGlobalList[an][0] != miniMe){
                this.multiSocket.send('{"message":"4.'+miniMe+'.'+playerGlobalList[an][0]+'.'+pawnID+'"}');
            }
        }
    }
    this.gameStateTwoSendPos = function(pawnPosX,pawnPosY){
        for (let am=0; am<playerGlobalList.length; am++){
            if (playerGlobalList[am][0] != miniMe){
                this.multiSocket.send('{"message":"5.'+miniMe+'.'+playerGlobalList[am][0]+'.'+pawnPosX.toString()+'.'+pawnPosY.toString()+'"}');
            }
        }
    }
    this.gameStateTwoSendUnclip = function(){
        for (let ao=0; ao<playerGlobalList.length; ao++){
            if (playerGlobalList[ao][0] != miniMe){
                this.multiSocket.send('{"message":"6.'+miniMe+'.'+playerGlobalList[ao][0]+'"}');
            }
        }
    }
    this.gameStateTwoReceive = function(message){
        if (message[0] == 3){
            if (message[1] != miniMe){
                this.multiBoard.remakePawnList(message[3]);
                this.multiBoard.turn = parseInt(message[4]);
                this.multiBoard.update();
                if (playerGlobalList[this.multiBoard.turn][0] == miniMe){
                    this.indicatorColor = "green";
                }
                this.update();
            }
        } else if (message[0] == 4){
            if (message[1] != miniMe){
                this.clickedPawn.push(this.multiBoard.getPawnByID(message[3]));
                this.multiBoard.boardPawns = reOrderArray(this.multiBoard.boardPawns, this.clickedPawn[0]);
            }
        } else if (message[0] == 5){
            if (message[1] != miniMe){
                this.clickedPawn[0].pawnRealX = parseInt(message[3]);
                this.clickedPawn[0].pawnRealY = parseInt(message[4]);
                this.multiBoard.update();
            }
        } else if (message[0] == 6){
            if (message[1] != miniMe){
                this.clickedPawn[0].pawnRealX = this.clickedPawn[0].getXYPawnPosition()[0];
                this.clickedPawn[0].pawnRealY = this.clickedPawn[0].getXYPawnPosition()[1];
                this.multiBoard.update();
                this.clickedPawn = [];
            }
        }
    }
}
