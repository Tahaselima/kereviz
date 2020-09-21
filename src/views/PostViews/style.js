
import {
    Dimensions
} from 'react-native';

const width = Dimensions.get('screen').width;

export default {
    header: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        flex: 1,
        height: 60,
        width: '100%',
        backgroundColor: '#202429',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#61dafb',
    },
    changeGridButton: {
        alignSelf: 'flex-end',
        marginRight: 5,
        justifyContent: 'center',
    },
    changeImage: {
        margin: 10,
        height: 30,
        width: 185,
    },
    sliderItemAreas: {
        width,
        height: 250,
        marginBottom: 10,
        backgroundColor: '#1c2025',
    },
    imageCover: {
        position: 'absolute',
        top: 10,
        left: 10,
        opacity: 0.5,
        height: '100%',
        width: '100%',
        borderRadius: 20,
    },
    sliderTextArea: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.42)',
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        width: '100%',
        padding: 15,
        left: 10,
        bottom: 30,
    },
    sliderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'left',
    },
    changeButtonArea: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    changeText: {
        fontWeight: '600',
        paddingLeft: 10,
        borderLeftColor: '#0668b3',
        borderLeftWidth: 2,
        marginLeft: 30,
        marginTop: 20,
    },
    gridChangeButton: {
        margin: 15,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    changeButtonImage: {
        height: 32,
        width: 32,
        marginBottom: 15,
    },

}
