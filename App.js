import React,{useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Pressable, Alert, LogBox } from 'react-native';
import Cell from './components/cell';

export default function App() {
  const [isXTurn, setIsXturn] = useState(true);
  const [mapArray,setMapArray] = useState([
    ['','',''],
    ['','',''],
    ['','','']
  ]) ;

  useEffect(() => {
    if(!isXTurn)
      botTurn();
  },[isXTurn])

  useEffect(() => {
    const winner = getWinner(mapArray);
    if(winner) {
      gameWon(winner);
    } else {
      checkTieState();
    }
  },[mapArray])

  function onPress(rowIndex, columnIndex) {
    if(mapArray[rowIndex][columnIndex] !== ''){
      return Alert.alert("Position already occupied!")
    }
  
    let cloneArray = [...mapArray];
    cloneArray[rowIndex][columnIndex] = isXTurn ? 'x':'o';
    setMapArray(cloneArray);

    // setMapArray((currentMapArray) => {
    //   let updateMapArray = [...currentMapArray];
    //   updateMapArray[rowIndex][columnIndex] = isXTurn ? 'x':'o';
    //   return updateMapArray;
    // })
    setIsXturn(!isXTurn);
  }

  const resetGame = () => {
    setMapArray([ 
    ['','',''],
    ['','',''],
    ['','','']
    ]);
    setIsXturn(true);
  }

  const botTurn = () => {
    // collect possbileOptions
    const possbileOptions = [];
    mapArray.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) =>{
        if(cell == '')
          possbileOptions.push({row:rowIndex,col:cellIndex})
      })
    })

    let chosenOption;
    // attack
    possbileOptions.forEach((positionOption) => {
      let cloneArray = JSON.parse(JSON.stringify(mapArray));
      cloneArray[positionOption.row][positionOption.col] = 'o';
      const winner = getWinner(cloneArray);

      if(winner == 'o')
        chosenOption = positionOption;  
        if(!chosenOption) {
          // defense strategy, check if there is a cell which could win
          possbileOptions.forEach((positionOption) => {
            let cloneArray = JSON.parse(JSON.stringify(mapArray));
            cloneArray[positionOption.row][positionOption.col] = 'x';
            const winner = getWinner(cloneArray);
            // console.log("I am in possbileOptions");
            if(winner == 'x')
              chosenOption = positionOption   
          })
        }
    })
    // no possbility to win, give it a random value
    if(!chosenOption) {
      if(possbileOptions.length != 0) {
        const ri = Math.floor(Math.random() * possbileOptions.length)
        chosenOption = possbileOptions[ri];
      }
    }
    // get a possiblity to win, then occupy it
    if(chosenOption) {
      onPress(chosenOption.row, chosenOption.col);
    }
  }

  const checkTieState = () => {
    if(!mapArray.some(row => row.some(cell => cell == '')))
      Alert.alert('It is a tie!', `tie`,[{
        text:'Restart',
        onPress: resetGame
      }])
  }
   
  const gameWon = (winner) => {
    // pass value here, and display who is the winner,better than judge here.
    let player = winner=='x' ? 'X':'O'
    Alert.alert('Hurray!', `Player ${player} Won`,[{
      text:'Restart',
      onPress: resetGame
    }])
  }

  const getWinner = (winnerMap) => {
    // same row to win
    for(let i = 0; i < 3; i++) {
      //The every() method returns true if the function returns true for all elements.
      const isRowXWinning = winnerMap[i].every((cell) => cell == 'x');
      const isRowOWinning = winnerMap[i].every((cell) => cell == 'o');

      if(isRowXWinning) {
        return 'x';
      }
      if(isRowOWinning) {
        return 'o';
      }
    }

    // same column to win
    for(let col = 0; col < 3; col++){

      let isColXWinning = true;
      let isColOWinning = true;
      for(let row = 0; row < 3; row++) {
        if(winnerMap[row][col] != 'x')
          isColXWinning = false;
        if(winnerMap[row][col] != 'o')
          isColOWinning = false;
      }
      if(isColOWinning)
        return 'o';
      if(isColXWinning)
        return 'x';
    }
    // diagonal to win
    let isDiagXWinning = true;
    let isDiagOWinning = true;
    let isDiagRXWinning = true;
    let isDiagROWinning = true;
  
    for(let i = 0; i < 3; i++) {
      if(winnerMap[i][i] != 'x')
        isDiagXWinning = false;
      if(winnerMap[i][i] != 'o')
        isDiagOWinning = false;


      if(winnerMap[i][2-i] != 'x')
        isDiagRXWinning = false;
      if(winnerMap[i][2-i] != 'o')
        isDiagROWinning = false;  
    }
   
    if(isDiagOWinning || isDiagROWinning)
      return 'o';
    if(isDiagXWinning || isDiagRXWinning)
      return 'x';
  }

  let currentPlayer = isXTurn ? 'X':'O';
  let textStr = "Current Turn is " + currentPlayer;

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require("./assets/bg.jpeg")} 
        resizeMode="contain"                   // cover is the default one.
        style={styles.bgPic}> 
     
        <Text style={{
          position:"absolute",
          top:50,
          fontSize:24,
          color:"white",
          marginBottom:50}}>{textStr}</Text>
        <View style={styles.map}> 
        {
          mapArray.map((row,rowIndex) => {         
            return (
              <View 
                key={`row-${rowIndex}`}       // `` is used when it is a template literal
                style={styles.row}>
                {
                  row.map((cell,columnIndex) => (<Cell  
                    cell={cell}
                    key={`row-${rowIndex}-col-${columnIndex}`}
                    onPress = {() => onPress(rowIndex,columnIndex)}
                  />))
                }
              </View>
            )})
        }
        </View>
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#242d34",
  },
  bgPic:{
    flex:1,
    width:"100%",            //specify width&height to shouw the background 
    height:"100%",
    alignItems:"center",
    justifyContent:"center",
    paddingTop:20 
  },
  map:{
    width:"80%",
    aspectRatio:1
  },
  row:{
    flex:1,
    flexDirection:"row",
  },
});
