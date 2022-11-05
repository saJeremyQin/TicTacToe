import {StyleSheet,View} from "react-native"

//define a function component
const Cross = () => { 
    return (
    <View style={styles.cross}>
        <View style={styles.crossLine}/>
        <View style={[styles.crossLine,styles.crossLineNegative]}/>
    </View>)
}


const styles = StyleSheet.create({
    cross:{
        flex:1,
        margin:10,
        // backgroundColor:"white"
      },
      crossLine:{
        position:'absolute',
        width:10,
        // height:75,
        height:"100%",
        marginLeft:34,
        backgroundColor:"white",
        borderRadius:5,
        transform:[{
          rotate:"45deg"}]
      },
      crossLineNegative:{
        transform:[{
          rotate:"-45deg"
        }]
      }
    }

)


export default Cross;