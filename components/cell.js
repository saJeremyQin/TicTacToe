import { StyleSheet, Pressable, View} from "react-native";
import Cross from "./cross"

const Cell = (props) => {
    const {cell,onPress} = props;

    return (
        <Pressable 
          style={styles.cell} 
          onPress={()=>onPress()}>
          {cell == 'o' && <View style={styles.circle} />}
          {cell == 'x' && <Cross />}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    cell:{
        flex:1,
    },
    circle:{
    flex:1,
    margin:16,
    // width:70,
    // height:70,

    borderRadius:35,
    backgroundColor: "#242d34",
    borderWidth:10,
    borderColor: "white",
    }
})

export default Cell;