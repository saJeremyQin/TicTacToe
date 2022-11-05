import React,{useState} from 'react';
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

  // onPress = (rowIndex, cellIndex)=>{
  //   console.warn("Hello Lucien!", rowIndex, cellIndex)
  // }
  function onPress(rowIndex, columnIndex) {
    // console.warn("Hello Lucien!", rowIndex, columnIndex);
    if(mapArray[rowIndex][columnIndex] !== '')
    {
      return Alert.alert("Position already occupied!")
    }
  
    // let cloneArray = JSON.parse(JSON.stringify(mapArray));
    let cloneArray = [...mapArray];
    cloneArray[rowIndex][columnIndex] = isXTurn ? 'x':'o';
    setMapArray(cloneArray);
    // console.log(mapArray);

    // setMapArray((currentMapArray) => {
    //   let updateMapArray = [...currentMapArray];
    //   updateMapArray[rowIndex][columnIndex] = isXTurn ? 'x':'o';
    //   return updateMapArray;
    // })
    // console.log(mapArray);

    const winner = getWinner();
    if(winner) {
      gameWon();
    } else {
      checkTieState();
    }
     
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

  const checkTieState = () => {
    if(!mapArray.some(row => row.some(cell => cell == '')))
      Alert.alert('It is a tie!', `tie`,[{
        text:'Restart',
        onPress: resetGame
      }])
  }
   

  const gameWon = () => {
    let player = isXTurn ? 'X':'O'
    Alert.alert('Hurray!', `Player ${player} Won`,[{
      text:'Restart',
      onPress: resetGame
    }])
  }

  const getWinner = () => {

    // same row to win

    for(let i = 0; i < 3; i++) {
      // console.log("I am in row ",i);
      //The every() method returns true if the function returns true for all elements.
      const isRowXWinning = mapArray[i].every((cell) => cell == 'x');
      const isRowOWinning = mapArray[i].every((cell) => cell == 'o');

      if(isRowXWinning) {
        // Alert.alert(`X won at row:${i} `);
        // gameWon();
        return 'x';
      }
      if(isRowOWinning) {
        // Alert.alert(`O won at row:${i} `);
        // gameWon();
        return 'o';
      }
    }

    // same column to win
  
    for(let col = 0; col < 3; col++){

      let isColXWinning = true;
      let isColOWinning = true;
      for(let row = 0; row < 3; row++) {
        if(mapArray[row][col] != 'x')
          isColXWinning = false;
        if(mapArray[row][col] != 'o')
          isColOWinning = false;
      }
      if(isColOWinning)
        // Alert.alert(`O won at col:${col}`);
        // gameWon();
        return 'o';
      if(isColXWinning)
        // Alert.alert(`X won at col:${col}`);
        // gameWon();
        return 'x';
    }

    // diagonal to win
    let isDiagXWinning = true;
    let isDiagOWinning = true;
    let isDiagRXWinning = true;
    let isDiagROWinning = true;
  
    for(let i = 0; i < 3; i++) {
      if(mapArray[i][i] != 'x')
        isDiagXWinning = false;
      if(mapArray[i][i] != 'o')
        isDiagOWinning = false;


      if(mapArray[i][2-i] != 'x')
        isDiagRXWinning = false;
      if(mapArray[i][2-i] != 'o')
        isDiagROWinning = false;  
    }
   
    if(isDiagOWinning || isDiagROWinning)
      // Alert.alert(`O won at diag`);
      // gameWon();
      return 'o';
    if(isDiagXWinning || isDiagRXWinning)
      // Alert.alert(`X won at diag`);
      // gameWon();
      return 'x';
  }

  let currentPlayer = isXTurn ? 'X':'O';
  let textStr = "Current Turn is " + currentPlayer;

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={require("./assets/bg.jpeg")} 
        resizeMode="contain"           // cover is the default one.
        style={styles.bgPic}> 

        {/* <View style={styles.map}>
          <View style={styles.circle}>
          </View>
         <View style={styles.cross}>
            <View style={styles.crossLine}/>
            <View style={[styles.crossLine,styles.crossLineNegative]}/>
          </View>  
        </View>  */}
     
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
    // flex:1,
    // borderWidth:1,
    // borderColor:"red",
    width:"80%",
    aspectRatio:1
  },
  row:{
    flex:1,
    flexDirection:"row",
  },
});
