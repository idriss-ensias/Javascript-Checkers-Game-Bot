function checkersTree(checkersAutoPlayer){
    this.checkersAutoPlayer = checkersAutoPlayer;
    this.treeNodeList = [];
    this.turnNum = 0;
    this.treeDepth = 0;
    this.dummyNode = new checkersNode("-1:-1","-1,-1",null,0,this,null);
    this.oldTreeNodeList = [];
    this.chosenMove = null;
    this.oppositeMove = null;
    this.getNode = function(getNodePawn, getNodeMov, getNodeLevel, nodeList) {
        for (let cj=0; cj<nodeList.length; cj++){
            if (nodeList[cj].nodePawn == getNodePawn){
                if (nodeList[cj].movePos[0][0] == getNodeMov[0]){
                    if (nodeList[cj].movePos[0][1] == getNodeMov[1]){
                        if (nodeList[cj].level == getNodeLevel){
                            return nodeList[cj]
                        }
                    }
                }
            }
        }
        return null;
    }
    this.getMovesToLevel = function(xLevel){
        this.addFirstLevel();
        for(let bz=2; bz<xLevel+1; bz++){
            this.addLevel(bz);
        }
    }
    this.getLevelNodes = function(xLevel){
        levelNodesArray = [];
        for (let bs=0; bs<this.treeNodeList.length; bs++){
            if (this.treeNodeList[bs].level == xLevel){
                levelNodesArray.push(this.treeNodeList[bs]);
            }
        }
        return levelNodesArray
    }
    this.getChildren = function(noNode){
        childrenList = 0;
        for (let ce=0; ce<this.treeNodeList.length; ce++){
            if(noNode.isParent(this.treeNodeList[ce])){
                if (this.treeNodeList[ce].level == this.treeDepth ){
                    childrenList += this.treeNodeList[ce].weight;
                }
            }
        }
        return childrenList;
    }
    this.getBestMove = function(){
        bestMove = 0;
        buffer = this.getChildren(this.treeNodeList[bestMove]);
        firstMoves = this.getLevelNodes(1);
        for (let cf=0; cf<firstMoves.length; cf++){
            console.log(this.getChildren(firstMoves[cf]));
            if(this.getChildren(firstMoves[cf])>buffer){
                bestMove = cf;
                buffer = this.getChildren(this.treeNodeList[bestMove]);
            }
        }
        return bestMove;
    }
    this.finalResult = function(fLevel){
        this.getMovesToLevel(fLevel);
        this.chosenMove = this.treeNodeList[this.getBestMove()];
        this.turnNum++;
        return this.chosenMove;
    }
    this.addFirstLevel = function(){
        this.treeNodeList = [];
        this.checkersAutoPlayer.initAutoBoard();
        pawnMoves = this.checkersAutoPlayer.autoBoard.getAllMoves(this.checkersAutoPlayer.autoPlayer);
        for (let ap=0; ap<pawnMoves.length; ap++){
            for (let aq=0; aq<pawnMoves[ap][1].length; aq++){
                this.treeNodeList.push(new checkersNode(pawnMoves[ap][0],pawnMoves[ap][1][aq],[this.dummyNode],1,this,this.checkersAutoPlayer.autoPlayer));
                this.checkersAutoPlayer.initAutoBoard();
            }
        }
        this.treeDepth = 1;
    }
    
    this.developNode = function(nodeDev){
        for (let bu=1; bu<nodeDev.level; bu++){
            for (let bv=0; bv<nodeDev.nodeParent.length; bv++){
                if (nodeDev.nodeParent[bv].level == bu){
                    nodeDev.nodeParent[bv].doNodeMovs();
                }
            }
        }
        nodeDev.doNodeMovs();
    }
    this.addLevel = function(xLevel){
        this.checkersAutoPlayer.initAutoBoard();
        xLevelNodes = this.getLevelNodes(xLevel-1);
        xLevelMoves = [];
        for(let bw=0; bw<xLevelNodes.length; bw++){
            this.checkersAutoPlayer.initAutoBoard();
            xLevelMoves = [];
            this.developNode(xLevelNodes[bw]);
            xLevelMoves = this.checkersAutoPlayer.autoBoard.getAllMoves(this.checkersAutoPlayer.autoBoard.players[xLevel%2].playerName);
            this.checkersAutoPlayer.initAutoBoard();
            for (let bx=0; bx<xLevelMoves.length; bx++){
                for (let by=0; by<xLevelMoves[bx][1].length; by++){
                    this.checkersAutoPlayer.initAutoBoard();
                    this.treeNodeList.push(new checkersNode(xLevelMoves[bx][0],xLevelMoves[bx][1][by],xLevelNodes[bw].nodeParent.concat([xLevelNodes[bw]]),xLevel,this,this.checkersAutoPlayer.autoBoard.players[xLevel%2].playerName));
                }
            }
        }
        this.treeDepth = xLevel;
    }
}
