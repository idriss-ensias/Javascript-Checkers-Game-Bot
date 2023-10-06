function isInsideCircle(x,y,circleX,circleY,circleR){
    if (Math.abs(x-circleX)<circleR){
        if (Math.abs(y-circleY)<circleR){
            return true;
        }
    }
    return false;
}
function compareTwoArrays(array1,array2){
    if(array1.length==array2.length){
        if(array1.length==0){
            return true;
        } else {
            for (let s=0; s<array1.length; s++){
                if (array1[s]!=array2[s]){
                    return false;
                }
            }
        }
    } else {
        return false;
    }
    return true;
}
function arrayIncludesNestedArray(array,nestedArray){
    for(let t=0; t<array.length; t++){
        if (compareTwoArrays(array[t],nestedArray)){
            return true;
        }
    }
    return false;
}
function isInsideSquare(x,y,squareX,squareY,squareProportion){
    if ((x-squareX)<squareProportion){
        if ((x-squareX)>0){
            if ((y-squareY)<squareProportion){
                if ((y-squareY)>0){
                    return true;
                }
            }
        }
    }
    return false;
}
function isInsideLogicalBoard(x,y){
    if (x>-1){
        if (x<8){
            if(y>-1){
                if(y<8){
                    return true;
                }
            }
        }
    }
    return false;
}
function getKingPos(x,y,prop,borderWidth){
    mainList = [[x+(prop/6),y+(prop/6)],[x+(prop/6),y+(5*prop/6)],[x+(5*prop/6),y+(5*prop/6)],[x+(5*prop/6),y+(prop/6)],[x+(4*prop/6),y+(3*prop/6)+borderWidth],[x+(3*prop/6),y+(prop/6)+borderWidth],[x+(2*prop/6),y+(3*prop/6)+borderWidth]];
    borderList = [[x+(prop/6)-borderWidth,y+(prop/6)-2*borderWidth],[x+(prop/6)-borderWidth,y+(5*prop/6)+borderWidth],[x+(5*prop/6)+borderWidth,y+(5*prop/6)+borderWidth],[x+(5*prop/6)+borderWidth,y+(prop/6)-2*borderWidth],[x+(4*prop/6),y+(3*prop/6)-2*borderWidth],[x+(3*prop/6),y+(prop/6)-2*borderWidth],[x+(2*prop/6),y+(3*prop/6)-2*borderWidth]];
    return [mainList,borderList];
}
function reOrderArray(orderArray,elementArray){
    newArray = [];
    for (let ac=0; ac<orderArray.length; ac++){
        if (orderArray[ac] != elementArray){
            newArray.push(orderArray[ac]);
        }
    }
    newArray.push(elementArray);
    return newArray;
}
function allPlayerOnline(playerList){
    for (let ag=0; ag<playerList.length; ag++){
        if (playerList[ag][1]==0){
            return false;
        }
    }
    return true;
}
function getPlayerIndex(playerName,playerList){
    for (let ah=0; ah<playerList.length; ah++){
        if(playerList[ah][0]==playerName){
            return ah;
        }
    }
    return false;
}
function getTrianglePos(dir){
    if (dir==0){
        return [[11/12,11/12],[23/24,11/12],[15/16,23/24]];
    } else {
        return [[15/16,11/12],[11/12,23/24],[23/24,23/24]];
    }
}
function incrementTime(){
    incTime++;
    checkersboard.update();
}
function getMin(sec){
    return [parseInt(sec/60),sec%60];
}
function representNum(num){
    if (num>=10){
        return num.toString();
    } else {
        return "0"+num.toString();
    }
}
function getTimeString(timeArr){
    return representNum(timeArr[0])+":"+representNum(timeArr[1]);
}
